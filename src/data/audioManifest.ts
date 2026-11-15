import type { MoodPatch } from '../components/audio/MusicBed';
import type { MusicMood } from '../story/types';

// Central audio configuration. Everything here is original and synthesized in the browser.
// - Character voices: data/voiceManifest.ts (set `sampleUrl` there to use a team-supplied blip).
// - Ambient music: one patch per mood below. Add `file: 'assets/audio/<name>.mp3'` to a mood to loop a
//   team-supplied track instead (only audio the team has the rights to use).

export type AudioChannel = 'music' | 'sfx' | 'voice';

/** Default channel volumes (0–1). The reader can change them in the pause menu; choices are remembered. */
export const defaultVolumes: Record<AudioChannel, number> = { music: 0.55, sfx: 0.8, voice: 0.85 };

export const musicPatches: Record<MusicMood, MoodPatch | null> = {
  // Deep, open fifths: the quiet between worlds.
  space: { notes: [73.42, 110, 164.81, 220], wave: 'sine', cutoffHz: 900, gain: 0.16, swell: 9 },
  // Warm and close: amber cabin light.
  interior: { notes: [87.31, 130.81, 174.61, 261.63], wave: 'triangle', cutoffHz: 620, gain: 0.11, swell: 7 },
  // Cold and still: suspended second, no third.
  moon: { notes: [82.41, 123.47, 185, 246.94], wave: 'sine', cutoffHz: 1100, gain: 0.15, swell: 11 },
  // Thin, distant, slightly hollow: a memory.
  archive: { notes: [98, 196, 293.66], wave: 'sine', cutoffHz: 1500, gain: 0.1, swell: 6 },
  // Dusty and wide: a low drone with a warm sixth.
  mars: { notes: [61.74, 92.5, 155.56, 207.65], wave: 'triangle', cutoffHz: 700, gain: 0.14, swell: 10 },
  // Major seventh, slow swells: the emotional scenes.
  emotional: { notes: [65.41, 98, 164.81, 246.94, 329.63], wave: 'sine', cutoffHz: 1300, gain: 0.17, swell: 8 },
  // The same chord opened upward for the ending.
  finale: { notes: [65.41, 130.81, 196, 246.94, 329.63, 392], wave: 'sine', cutoffHz: 1800, gain: 0.18, swell: 7 },
  silence: null,
};
