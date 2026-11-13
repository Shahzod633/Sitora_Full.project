import React from 'react';
import { useAudio } from './AudioContext';

export default function SoundToggle() {
  const { isMuted, muteAll, unmuteAll } = useAudio();
  return <button type="button" className="sound-toggle" aria-label="Toggle sound" aria-pressed={!isMuted}
    title={isMuted ? 'Enable sound' : 'Mute sound'} onClick={isMuted ? unmuteAll : muteAll}>
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 9h4l5-4v14l-5-4H3z"/>{isMuted ? <path d="m16 9 6 6m0-6-6 6"/> : <path d="M15 8q4 4 0 8m3-11q7 7 0 14"/>}
    </svg>
  </button>;
}
