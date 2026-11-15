import React from 'react';
import { useAudio } from './AudioContext';
import type { AudioChannel } from '../../data/audioManifest';

const channels: { id: AudioChannel; label: string }[] = [
  { id: 'music', label: 'Music' },
  { id: 'sfx', label: 'Effects' },
  { id: 'voice', label: 'Voices' },
];

/** Master mute plus music, sound-effect and dialogue-voice volumes. Choices are remembered on this device. */
export default function SoundSettings() {
  const { isMuted, muteAll, unmuteAll, volumes, setVolume } = useAudio();
  return <div className="sound-settings">
    <label className="sound-mute">
      <input type="checkbox" checked={!isMuted} onChange={e => (e.target.checked ? unmuteAll() : muteAll())}/>
      Sound on
    </label>
    {channels.map(({ id, label }) => {
      const percent = Math.round(volumes[id] * 100);
      return <label key={id} className="sound-row">
        <span>{label}</span>
        <input type="range" min={0} max={100} step={5} value={percent} disabled={isMuted}
          onChange={e => setVolume(id, Number(e.target.value) / 100)} aria-valuetext={`${percent} percent`}/>
        <output>{percent}%</output>
      </label>;
    })}
  </div>;
}
