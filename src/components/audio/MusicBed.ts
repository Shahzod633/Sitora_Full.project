import type { MusicMood } from '../../story/types';

// Original ambient bed, synthesized in the browser: a few slow, detuned partials per mood that breathe
// independently. No samples and no third-party recordings. To use composed music instead, add `file` to a
// mood in data/audioManifest.ts — the bed then loops that file and skips the synthesis for that mood.

export type MoodPatch = {
  /** Partials in Hz. Kept low and soft so dialogue blips stay on top. */
  notes: readonly number[];
  wave: OscillatorType;
  cutoffHz: number;
  gain: number;
  /** Seconds for one swell of a partial. */
  swell: number;
  /** Optional looped file under public/ (team-supplied, with usage rights). */
  file?: string;
};

type Voice = { out: GainNode; nodes: AudioNode[]; sources: AudioScheduledSourceNode[] };

const FADE = 2.4;

export class MusicBed {
  private voice?: Voice;
  private mood: MusicMood = 'silence';
  private level = 1;
  private bus: GainNode;
  private buffers = new Map<string, AudioBuffer>();
  private disposed = false;

  constructor(private ctx: AudioContext, destination: AudioNode, private patches: Record<MusicMood, MoodPatch | null>,
    private resolveUrl: (path: string) => string) {
    this.bus = ctx.createGain();
    this.bus.gain.value = 1;
    this.bus.connect(destination);
  }

  set(mood: MusicMood, level = 1) {
    if (this.disposed) return;
    const t = this.ctx.currentTime;
    if (level !== this.level) {
      this.level = level;
      this.bus.gain.cancelScheduledValues(t);
      this.bus.gain.setTargetAtTime(Math.max(0, level), t, 0.9);
    }
    if (mood === this.mood) return;
    this.mood = mood;
    this.release(FADE);
    const patch = this.patches[mood];
    if (!patch) return;
    if (patch.file) void this.startFile(mood, patch);
    else this.voice = this.synth(patch);
  }

  /** Fade out and free the current voice (also used when the story unmounts). */
  release(seconds = 0.4) {
    const voice = this.voice;
    this.voice = undefined;
    if (!voice) return;
    const t = this.ctx.currentTime;
    voice.out.gain.cancelScheduledValues(t);
    voice.out.gain.setTargetAtTime(0, t, seconds / 4);
    for (const source of voice.sources) {
      try { source.stop(t + seconds + 0.2); } catch { /* already stopped */ }
    }
    window.setTimeout(() => voice.nodes.forEach(node => node.disconnect()), (seconds + 0.5) * 1000);
  }

  stop() {
    this.mood = 'silence';
    this.release(0.3);
  }

  dispose() {
    this.disposed = true;
    this.stop();
    this.bus.disconnect();
    this.buffers.clear();
  }

  private synth(patch: MoodPatch): Voice {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, t);
    out.gain.linearRampToValueAtTime(patch.gain, t + FADE);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = patch.cutoffHz;
    filter.Q.value = 0.4;
    filter.connect(out);
    out.connect(this.bus);
    const nodes: AudioNode[] = [out, filter];
    const sources: AudioScheduledSourceNode[] = [];
    patch.notes.forEach((hz, i) => {
      // Two slightly detuned oscillators per partial for a soft chorus.
      for (const detune of [-4, 5]) {
        const osc = ctx.createOscillator();
        osc.type = patch.wave;
        osc.frequency.value = hz;
        osc.detune.value = detune + i;
        const gain = ctx.createGain();
        gain.gain.value = 0.5 / patch.notes.length;
        // Each partial swells on its own slow cycle, so the chord never sits still.
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 1 / (patch.swell * (1 + i * 0.37 + (detune > 0 ? 0.11 : 0)));
        const depth = ctx.createGain();
        depth.gain.value = 0.32 / patch.notes.length;
        lfo.connect(depth).connect(gain.gain);
        osc.connect(gain).connect(filter);
        osc.start(t);
        lfo.start(t);
        nodes.push(osc, gain, lfo, depth);
        sources.push(osc, lfo);
      }
    });
    return { out, nodes, sources };
  }

  private async startFile(mood: MusicMood, patch: MoodPatch) {
    const url = this.resolveUrl(patch.file!);
    let buffer = this.buffers.get(url);
    if (!buffer) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(String(response.status));
        buffer = await this.ctx.decodeAudioData(await response.arrayBuffer());
        this.buffers.set(url, buffer);
      } catch {
        buffer = undefined; // Missing or undecodable file: fall back to the synthesized bed.
      }
    }
    if (this.disposed || this.mood !== mood || this.voice) return;
    if (!buffer) {
      this.voice = this.synth(patch);
      return;
    }
    const t = this.ctx.currentTime;
    const out = this.ctx.createGain();
    out.gain.setValueAtTime(0, t);
    out.gain.linearRampToValueAtTime(patch.gain, t + FADE);
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(out).connect(this.bus);
    source.start(t);
    this.voice = { out, nodes: [out, source], sources: [source] };
  }
}
