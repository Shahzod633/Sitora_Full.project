export type VoiceProfile = {
  // Optional URL of an authorized, trimmed blip. Synthesis also covers load failures.
  sampleUrl?: string;
  waveform: OscillatorType;
  pitchHz: number;
  pitchSteps: readonly number[]; // semitones, cycled on successive blips
  endPitchRatio: number;
  stepped: boolean;
  cutoffHz: number;
  attackMs: number;
  durationMs: number;
  playbackRate: number;
  volume: number;
  everyLetters: number;
};

export const voiceManifest = {
  volume: 0.62,
  maxSimultaneous: 1,
  profiles: {
    mara: {
      waveform: 'triangle', pitchHz: 192, pitchSteps: [0, -1, 0, 1], endPitchRatio: 0.94,
      stepped: false, cutoffHz: 790, attackMs: 9, durationMs: 48,
      playbackRate: 1, volume: 0.36, everyLetters: 3,
    },
    eli: {
      waveform: 'sawtooth', pitchHz: 305, pitchSteps: [0, 3, -2, 2, 0, 4], endPitchRatio: 0.81,
      stepped: false, cutoffHz: 1630, attackMs: 3, durationMs: 32,
      playbackRate: 1, volume: 0.26, everyLetters: 2,
    },
    pip: {
      waveform: 'sine', pitchHz: 525, pitchSteps: [0, 2, 0, -2], endPitchRatio: 1.12,
      stepped: true, cutoffHz: 2500, attackMs: 5, durationMs: 41,
      playbackRate: 1, volume: 0.27, everyLetters: 3,
    },
  } satisfies Record<string, VoiceProfile>,
};

export type VoiceId = keyof typeof voiceManifest.profiles;
