import React from 'react';

export function AsterMark() {
  return <svg className="aster-mark" viewBox="0 0 44 44" fill="none" aria-hidden="true">
    <path d="m22 2 3.4 14.7L38 12l-9.8 10L42 25l-15.8 2.1L22 42l-3.9-15L3 22l14.2-3.9L13 7l7.2 9.3z" fill="currentColor"/>
    <circle cx="22" cy="22" r="3.1" fill="#183139"/>
  </svg>;
}

export const sceneNames = ['Earth Departure', 'Aster Bridge', 'Apollo Legacy'];

export default function ChapterFrame({ scene }: { scene: number }) {
  return <>
    <header className="chapter-mast">
      <div className="wordmark"><AsterMark/><span>ASTER</span></div>
      <div className="chapter-name"><span>Chapter 01</span> Where It All Began</div>
    </header>
    <div className="scene-position" aria-label={`Scene ${scene} of 3`}>
      <span>0{scene}</span><i/>03
    </div>
    <div className={`scene-caption ${scene === 1 ? 'departure-caption' : ''}`}>
      <div className="frame-ticks" aria-hidden="true"><i/><i/><i/></div>
      <h1>{sceneNames[scene - 1]}</h1>
    </div>
  </>;
}
