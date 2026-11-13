import React from 'react';
import { gsap } from 'gsap';
import './EarthDeparture.css';
import { assetManifest as art } from '../../../data/assetManifest';
import SceneArt from '../../../components/visual/SceneArt';
import ChapterFrame from '../../../components/visual/ChapterFrame';

export default function EarthDeparture({ onNext }: { onNext: () => void }) {
  const scene = React.useRef<HTMLDivElement>(null);
  const [ready, setReady] = React.useState(false);

  React.useLayoutEffect(() => {
    const motion = gsap.matchMedia();
    motion.add({ reduced: '(prefers-reduced-motion: reduce)', normal: '(prefers-reduced-motion: no-preference)' }, ctx => {
      if (ctx.conditions?.reduced) {
        setReady(true);
        return;
      }
      setReady(false);
      const timeline = gsap.timeline();
      timeline.from('.earth-globe', { opacity: 0.35, duration: 1 }, 0)
        .from('.departure-camera', { scale: 1.045, duration: 6.5, ease: 'sine.out' }, 0)
        .from('.aster-flight', { x: () => scene.current!.clientWidth * .76, duration: 2.7, ease: 'power2.out' }, .25)
        .call(() => setReady(true), [], 2.95)
        .to('.aster-flight', { xPercent: -8, yPercent: 4, duration: 3.6, ease: 'sine.out' }, 2.95);
    }, scene);
    return () => motion.revert();
  }, []);

  return <main className="scene earth-departure" ref={scene}>
    <div className="departure-camera art-stage">
      <SceneArt asset={art.backgrounds.spaceStars} className="space-sky"/>
      <svg className="orbit-trace" viewBox="0 0 1600 850" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-90 645Q345 778 849 428T1750 132" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 8"/>
      </svg>
      <SceneArt asset={art.backgrounds.earth} className="earth-globe" label="Earth seen from orbit"/>
      <SceneArt asset={art.objects.asterSpaceship} className="aster-flight" label="Aster spacecraft departing Earth"/>
    </div>
    <ChapterFrame scene={1}/>
    <button className="next-button" onClick={onNext} disabled={!ready}>Continue</button>
  </main>;
}
