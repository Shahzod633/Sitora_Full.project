import { assetManifest, publicUrl } from '../../data/assetManifest';
import { defaultVolumes, musicPatches, type AudioChannel } from '../../data/audioManifest';
import { voiceManifest, type VoiceProfile } from '../../data/voiceManifest';
import type { MusicMood, SoundCue } from '../../story/types';
import { MusicBed } from './MusicBed';

type Source = OscillatorNode | AudioBufferSourceNode;

// Owned by AudioProvider. No browser resources are allocated before a gesture.
// Signal path: voice / sfx / music buses → master (mute) → destination.
export class DialogueAudio {
  private context?: AudioContext;
  private master?: GainNode;
  private buses?: Record<AudioChannel, GainNode>;
  private music?: MusicBed;
  private buffers = new Map<string, AudioBuffer>();
  private requested = new Set<string>();
  private requests = new AbortController();
  private voices = new Set<Source>();
  private muted = false;
  private volumes: Record<AudioChannel, number> = { ...defaultVolumes };
  private pendingMusic?: { mood: MusicMood; level: number };
  private noiseBuffer?: AudioBuffer;

  async unlock() {
    if (!this.context) {
      const ctx = new AudioContext();
      this.context = ctx;
      this.master = ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 1;
      this.master.connect(ctx.destination);
      const bus = (channel: AudioChannel) => {
        const node = ctx.createGain();
        node.gain.value = this.volumes[channel];
        node.connect(this.master!);
        return node;
      };
      this.buses = { voice: bus('voice'), sfx: bus('sfx'), music: bus('music') };
      this.music = new MusicBed(ctx, this.buses.music, musicPatches, publicUrl);
    }
    const ctx = this.context;
    if (ctx.state !== 'running') await ctx.resume();
    if (this.context !== ctx) return;
    for (const profile of Object.values<VoiceProfile>(voiceManifest.profiles)) {
      if (profile.sampleUrl) void this.load(ctx, profile.sampleUrl);
    }
    void this.load(ctx, assetManifest.audio.click);
    if (this.pendingMusic) this.music?.set(this.pendingMusic.mood, this.pendingMusic.level);
  }

  private async load(ctx: AudioContext, url: string) {
    if (this.requested.has(url)) return;
    this.requested.add(url);
    try {
      const response = await fetch(url, { signal: this.requests.signal });
      if (!response.ok) return;
      const buffer = await ctx.decodeAudioData(await response.arrayBuffer());
      if (this.context === ctx) this.buffers.set(url, buffer);
    } catch {
      // Optional samples can be missing, undecodable or cancelled on unmount.
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.context) this.master.gain.setTargetAtTime(muted ? 0 : 1, this.context.currentTime, 0.03);
    if (muted) this.stopVoice();
  }

  setVolume(channel: AudioChannel, value: number) {
    this.volumes[channel] = Math.min(1, Math.max(0, value));
    const bus = this.buses?.[channel];
    if (bus && this.context) bus.gain.setTargetAtTime(this.volumes[channel], this.context.currentTime, 0.05);
  }

  /** Ambient bed for the current scene. Remembered until audio is unlocked. */
  setMusic(mood: MusicMood, level = 1) {
    this.pendingMusic = { mood, level };
    if (this.context?.state === 'running') this.music?.set(mood, level);
  }

  /** Scene/chapter unmount: nothing may keep sounding. */
  stopAll() {
    this.stopVoice();
    this.pendingMusic = undefined;
    this.music?.stop();
  }

  /** Reader pause: suspend the clock so the bed and any ringing cue freeze with the story. */
  suspend() {
    if (this.context?.state === 'running') void this.context.suspend().catch(() => {});
  }

  resume() {
    if (this.context?.state === 'suspended') void this.context.resume().catch(() => {});
  }

  stopVoice() {
    for (const source of this.voices) {
      source.stop();
      source.disconnect();
    }
    this.voices.clear();
  }

  playVoice(profile: VoiceProfile, blip: number) {
    const ctx = this.context;
    if (!ctx || ctx.state !== 'running' || !this.buses || this.muted ||
        this.voices.size >= voiceManifest.maxSimultaneous) return;

    const start = ctx.currentTime;
    const semitones = profile.pitchSteps[blip % profile.pitchSteps.length] ?? 0;
    const variation = 2 ** (semitones / 12);
    const rate = profile.playbackRate * variation;
    const buffer = profile.sampleUrl && this.buffers.get(profile.sampleUrl);
    const duration = Math.min(profile.durationMs / 1000, buffer ? buffer.duration / rate : Infinity);
    const end = start + duration;
    const envelope = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = profile.cutoffHz;
    filter.Q.value = 0.55;
    filter.connect(envelope);
    envelope.connect(this.buses.voice);
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(profile.volume * voiceManifest.volume,
      start + Math.min(profile.attackMs / 1000, duration / 2));
    envelope.gain.exponentialRampToValueAtTime(0.0001, end);

    let source: Source;
    if (buffer) {
      const sample = ctx.createBufferSource();
      sample.buffer = buffer;
      sample.playbackRate.value = rate;
      source = sample;
    } else {
      const osc = ctx.createOscillator();
      const pitch = profile.pitchHz * rate;
      osc.type = profile.waveform;
      osc.frequency.setValueAtTime(pitch, start);
      if (profile.stepped) osc.frequency.setValueAtTime(pitch * profile.endPitchRatio, start + duration * 0.48);
      else osc.frequency.exponentialRampToValueAtTime(pitch * profile.endPitchRatio, end);
      source = osc;
    }
    source.connect(filter);
    this.voices.add(source);
    source.onended = () => {
      this.voices.delete(source);
      source.disconnect();
      filter.disconnect();
      envelope.disconnect();
    };
    source.start(start);
    source.stop(end);
  }

  /** Short original synthesized story cues. Quiet by design and skipped while muted or locked. */
  playCue(name: SoundCue) {
    const ctx = this.context;
    if (!ctx || !this.buses || this.muted || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    switch (name) {
      case 'computer':
        this.tone(659, t, 0.14, 'sine', 0.07);
        this.tone(988, t + 0.16, 0.24, 'sine', 0.06);
        break;
      case 'scan':
        this.tone(330, t, 1.2, 'sine', 0.035, 990);
        this.tone(660, t + 0.1, 1, 'triangle', 0.015, 1320);
        break;
      case 'save':
        this.tone(523, t, 0.08, 'triangle', 0.05);
        this.tone(659, t + 0.1, 0.08, 'triangle', 0.05);
        this.tone(784, t + 0.2, 0.16, 'triangle', 0.05);
        break;
      case 'hotspot':
        this.tone(880, t, 0.2, 'sine', 0.05, 660);
        break;
      case 'archive':
        this.noise(t, 1.8, 1100, 0.035);
        this.tone(110, t, 1.6, 'sine', 0.03, 98);
        break;
      case 'rumble':
        this.noise(t, 2.8, 170, 0.12);
        break;
      case 'entry': // Atmospheric entry: a longer roar than the airless lunar landing.
        this.noise(t, 5.5, 420, 0.1);
        this.noise(t + 0.4, 4.5, 120, 0.12);
        break;
      case 'wind':
        this.noise(t, 4.2, 520, 0.045);
        break;
      case 'brush': // One soft sweep of dust.
        this.noise(t, 0.22, 2400, 0.045);
        break;
      case 'reveal':
        this.tone(196, t, 1.6, 'sine', 0.05);
        this.tone(293.66, t + 0.18, 1.5, 'sine', 0.045);
        this.tone(440, t + 0.36, 1.6, 'sine', 0.04);
        break;
      case 'rover': // Small electric motors.
        this.tone(92, t, 0.16, 'sawtooth', 0.018, 104);
        break;
      case 'apxs':
        for (let i = 0; i < 7; i++) this.tone(1200 + i * 90, t + i * 0.16, 0.05, 'square', 0.014);
        this.tone(523, t + 1.3, 0.3, 'triangle', 0.04);
        break;
      case 'tick':
        this.tone(740, t, 0.05, 'triangle', 0.03);
        break;
      case 'hologram':
        this.tone(880, t, 0.9, 'sine', 0.025, 1760);
        this.tone(1320, t + 0.12, 0.8, 'sine', 0.014, 1980);
        break;
      case 'authorize':
        this.tone(392, t, 0.16, 'triangle', 0.05);
        this.tone(587.33, t + 0.2, 0.32, 'triangle', 0.05);
        break;
      case 'chime':
        this.tone(659.25, t, 1.4, 'sine', 0.04);
        this.tone(987.77, t + 0.05, 1.2, 'sine', 0.02);
        break;
    }
  }

  private tone(freq: number, start: number, duration: number, type: OscillatorType, volume: number, endFreq?: number) {
    const ctx = this.context!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, start + duration);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume * voiceManifest.volume, start + Math.min(0.02, duration / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(this.buses!.sfx);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  private noise(start: number, duration: number, cutoff: number, volume: number) {
    const ctx = this.context!;
    if (!this.noiseBuffer) {
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = buffer;
    }
    const source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume * voiceManifest.volume, start + duration * 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter).connect(gain).connect(this.buses!.sfx);
    source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
    source.start(start);
    source.stop(start + duration + 0.05);
  }

  playClick() {
    const ctx = this.context;
    const buffer = this.buffers.get(assetManifest.audio.click);
    if (!ctx || !buffer || !this.buses || this.muted || ctx.state !== 'running') return;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.buses.sfx);
    source.onended = () => source.disconnect();
    source.start();
  }

  dispose() {
    this.requests.abort();
    this.stopVoice();
    this.music?.dispose();
    this.master?.disconnect();
    if (this.context) void this.context.close().catch(() => {});
    this.context = undefined;
    this.buffers.clear();
  }
}
