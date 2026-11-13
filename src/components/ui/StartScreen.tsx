import React from 'react';
import './StartScreen.css';
import { useAudio } from '../audio/AudioContext';
import SoundToggle from '../audio/SoundToggle';
import SceneArt from '../visual/SceneArt';
import { AsterMark } from '../visual/ChapterFrame';
import { assetManifest as art } from '../../data/assetManifest';

export default function StartScreen({ onBegin }: { onBegin: () => void }) {
  const { unlock } = useAudio();
  return <main className="scene start-screen">
    <SceneArt asset={art.backgrounds.spaceStars} className="space-sky"/>
    <SceneArt asset={art.backgrounds.earth} className="cover-earth" label="Earth seen from orbit"/>
    <div className="cover-copy">
      <AsterMark/>
      <h1 className="title">ASTER<span>Abandoned But Not Forgotten</span></h1>
      <h2 className="chapter-label">Chapter 01</h2>
      <button className="begin-button" onClick={() => { unlock(); onBegin(); }}>Begin Chapter 01</button>
    </div>
    <SoundToggle/>
  </main>;
}
