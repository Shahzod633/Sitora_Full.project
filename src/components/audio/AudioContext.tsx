import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DialogueAudio } from './DialogueAudio';
import { type VoiceProfile } from '../../data/voiceManifest';
import type { SoundCue } from '../../story/types';

type AudioControls = {
  unlock: () => void;
  playVoice: (profile: VoiceProfile, blip: number) => void;
  stopVoice: () => void;
  playCue: (cue: SoundCue) => void;
  playClick: () => void;
  muteAll: () => void;
  unmuteAll: () => void;
  isMuted: boolean;
};

const AudioContext = createContext<AudioControls | undefined>(undefined);
const muteKey = 'aster.sound.muted';

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem(muteKey) === 'true'; } catch { return false; }
  });
  const [unavailable, setUnavailable] = useState(false);
  const preference = useRef(muted);
  const engine = useRef<DialogueAudio | null>(null);

  const unlock = useCallback(() => {
    const player = engine.current ??= new DialogueAudio();
    player.setMuted(preference.current);
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
  const playVoice = useCallback((profile: VoiceProfile, blip: number) => engine.current?.playVoice(profile, blip), []);
  const stopVoice = useCallback(() => engine.current?.stopVoice(), []);
  const playCue = useCallback((cue: SoundCue) => engine.current?.playCue(cue), []);
  const playClick = useCallback(() => engine.current?.playClick(), []);
  useEffect(() => () => {
    engine.current?.dispose();
    engine.current = null;
  }, []);

  const value = useMemo<AudioControls>(() => ({
    unlock, playVoice, stopVoice, playCue, playClick,
    isMuted: muted || unavailable, muteAll: () => changeMute(true), unmuteAll: () => changeMute(false),
  }), [unlock, playVoice, stopVoice, playCue, playClick, muted, unavailable, changeMute]);

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within an AudioProvider');
  return ctx;
}
