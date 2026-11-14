import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DialogueAudio } from './DialogueAudio';
import { defaultVolumes, type AudioChannel } from '../../data/audioManifest';
import { type VoiceProfile } from '../../data/voiceManifest';
import type { MusicMood, SoundCue } from '../../story/types';

type AudioControls = {
  unlock: () => void;
  playVoice: (profile: VoiceProfile, blip: number) => void;
  stopVoice: () => void;
  playCue: (cue: SoundCue) => void;
  playClick: () => void;
  /** Ambient bed for the current scene. */
  setMusic: (mood: MusicMood, level?: number) => void;
  /** Stop everything that is sounding (chapter or scene unmount). */
  stopAll: () => void;
  /** Freeze / unfreeze audio with the story (reader pause). */
  suspend: () => void;
  resume: () => void;
  muteAll: () => void;
  unmuteAll: () => void;
  isMuted: boolean;
  volumes: Record<AudioChannel, number>;
  setVolume: (channel: AudioChannel, value: number) => void;
};

const AudioContext = createContext<AudioControls | undefined>(undefined);
const muteKey = 'aster.sound.muted';
const volumeKey = 'aster.sound.volumes';

function storedVolumes(): Record<AudioChannel, number> {
  try {
    const saved = JSON.parse(localStorage.getItem(volumeKey) ?? '{}') as Partial<Record<AudioChannel, unknown>>;
    const read = (channel: AudioChannel) => {
      const value = saved[channel];
      return typeof value === 'number' && value >= 0 && value <= 1 ? value : defaultVolumes[channel];
    };
    return { music: read('music'), sfx: read('sfx'), voice: read('voice') };
  } catch {
    return { ...defaultVolumes };
  }
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem(muteKey) === 'true'; } catch { return false; }
  });
  const [volumes, setVolumes] = useState(storedVolumes);
  const [unavailable, setUnavailable] = useState(false);
  const preference = useRef(muted);
  const levels = useRef(volumes);
  const engine = useRef<DialogueAudio | null>(null);
  const music = useRef<{ mood: MusicMood; level: number } | null>(null);

  const unlock = useCallback(() => {
    const created = !engine.current;
    const player = engine.current ??= new DialogueAudio();
    player.setMuted(preference.current);
    if (created) {
      (Object.keys(levels.current) as AudioChannel[]).forEach(channel => player.setVolume(channel, levels.current[channel]));
      if (music.current) player.setMusic(music.current.mood, music.current.level);
    }
    // Call resume inside the originating click/tap, before any await.
    void player.unlock().then(() => {
      if (engine.current === player) setUnavailable(false);
    }).catch(() => {
      if (engine.current === player) setUnavailable(true);
    });
  }, []);

  const changeMute = useCallback((value: boolean) => {
    preference.current = value;
    setMuted(value);
    engine.current?.setMuted(value);
    try { localStorage.setItem(muteKey, String(value)); } catch { /* Session preference still works. */ }
    if (!value) unlock();
  }, [unlock]);

  const setVolume = useCallback((channel: AudioChannel, value: number) => {
    const next = { ...levels.current, [channel]: Math.min(1, Math.max(0, value)) };
    levels.current = next;
    setVolumes(next);
    engine.current?.setVolume(channel, next[channel]);
    try { localStorage.setItem(volumeKey, JSON.stringify(next)); } catch { /* Session preference still works. */ }
  }, []);

  const playVoice = useCallback((profile: VoiceProfile, blip: number) => engine.current?.playVoice(profile, blip), []);
  const stopVoice = useCallback(() => engine.current?.stopVoice(), []);
  const playCue = useCallback((cue: SoundCue) => engine.current?.playCue(cue), []);
  const playClick = useCallback(() => engine.current?.playClick(), []);
  const setMusic = useCallback((mood: MusicMood, level = 1) => {
    music.current = { mood, level };
    engine.current?.setMusic(mood, level);
  }, []);
  const stopAll = useCallback(() => {
    music.current = null;
    engine.current?.stopAll();
  }, []);
  const suspend = useCallback(() => engine.current?.suspend(), []);
  const resume = useCallback(() => engine.current?.resume(), []);

  useEffect(() => () => {
    engine.current?.dispose();
    engine.current = null;
  }, []);

  const value = useMemo<AudioControls>(() => ({
    unlock, playVoice, stopVoice, playCue, playClick, setMusic, stopAll, suspend, resume, volumes, setVolume,
    isMuted: muted || unavailable, muteAll: () => changeMute(true), unmuteAll: () => changeMute(false),
  }), [unlock, playVoice, stopVoice, playCue, playClick, setMusic, stopAll, suspend, resume, volumes, setVolume,
    muted, unavailable, changeMute]);

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within an AudioProvider');
  return ctx;
}
