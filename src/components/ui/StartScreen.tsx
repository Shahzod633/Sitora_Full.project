import React from 'react';
import { gsap } from 'gsap';
import './StartScreen.css';
import { useAudio } from '../audio/AudioContext';
import SoundToggle from '../audio/SoundToggle';
import SceneArt from '../visual/SceneArt';
import { AsterMark } from '../visual/ChapterFrame';
import { preloadAssets } from '../../data/assetManifest';

type Props = { onBegin: () => void; onCredits: () => void };

export default function StartScreen({ onBegin, onCredits }: Props) {
  const { unlock } = useAudio();
  const root = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    // Warm the first sequences while the reader is on the title.
    preloadAssets(['spaceStars', 'earth', 'aster', 'moonGlobe', 'cockpit', 'mara', 'eli', 'pipFull']);
  }, []);

  React.useLayoutEffect(() => {
    // The entrance is CSS (time-based, so the title and Begin button can never be left hidden).
    // GSAP only adds the slow, purely decorative drift of the globe.
    const motion = gsap.matchMedia();
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to('.cover-earth', { rotation: 2.5, duration: 40, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }, root);
    return () => motion.revert();
  }, []);

  return <main className="scene start-screen" ref={root}>
    <SceneArt asset="spaceStars" className="space-sky"/>
    <span className="cover-glow" aria-hidden="true"/>
    <SceneArt asset="earth" className="cover-earth" label="Earth seen from orbit"/>
    <span className="cover-aster-track" aria-hidden="true"><SceneArt asset="aster" className="cover-aster"/></span>
    <div className="cover-copy">
      <AsterMark/>
      <h1 className="title">ASTER</h1>
      <p className="subtitle">Abandoned But Not Forgotten</p>
      <p className="chapter-label"><span>Chapter 01</span> Where It All Began</p>
      <button type="button" className="begin-button" onClick={() => { unlock(); onBegin(); }}>Begin Chapter</button>
    </div>
    <div className="cover-tools">
      <button type="button" className="text-button" onClick={onCredits}>Credits &amp; Sources</button>
      <SoundToggle/>
    </div>
  </main>;
}
