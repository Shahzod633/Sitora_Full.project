import { assetManifest } from '../../data/assetManifest';
import { voiceManifest, type VoiceProfile } from '../../data/voiceManifest';
import type { SoundCue } from '../../story/types';

type Source = OscillatorNode | AudioBufferSourceNode;

// Owned by AudioProvider. No browser resources are allocated before a gesture.
export class DialogueAudio {
  private context?: AudioContext;
  private master?: GainNode;
  private buffers = new Map<string, AudioBuffer>();
  private requested = new Set<string>();
  private requests = new AbortController();
  private voices = new Set<Source>();
  private muted = false;
  private noiseBuffer?: AudioBuffer;

  async unlock() {
    if (!this.context) {
      const ctx = new AudioContext();
      this.context = ctx;
      this.master = ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 1;
      this.master.connect(ctx.destination);
    }
    const ctx = this.context;
    if (ctx.state !== 'running') await ctx.resume();
    if (this.context !== ctx) return;
    for (const profile of Object.values<VoiceProfile>(voiceManifest.profiles)) {
      if (profile.sampleUrl) void this.load(ctx, profile.sampleUrl);
    }
    void this.load(ctx, assetManifest.audio.click);
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
    if (this.master) this.master.gain.value = muted ? 0 : 1;
    if (muted) this.stopVoice();
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
    if (!ctx || ctx.state !== 'running' || !this.master || this.muted ||
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
    envelope.connect(this.master);
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
    if (!ctx || !this.master || this.muted || ctx.state !== 'running') return;
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
    osc.connect(gain).connect(this.master!);
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
    source.connect(filter).connect(gain).connect(this.master!);
    source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
    source.start(start);
    source.stop(start + duration + 0.05);
  }

  playClick() {
    const ctx = this.context;
    const buffer = this.buffers.get(assetManifest.audio.click);
    if (!ctx || !buffer || !this.master || this.muted || ctx.state !== 'running') return;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.master);
    source.onended = () => source.disconnect();
    source.start();
  }

  dispose() {
    this.requests.abort();
    this.stopVoice();
    this.master?.disconnect();
    if (this.context) void this.context.close().catch(() => {});
    this.context = undefined;
    this.buffers.clear();
  }
}
