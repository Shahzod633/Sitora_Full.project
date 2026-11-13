import React from 'react';
import './ChapterEndScreen.css';
import SceneArt from '../visual/SceneArt';
import { AsterMark } from '../visual/ChapterFrame';
import { assetManifest } from '../../data/assetManifest';

export default function ChapterEndScreen({ onReplay }: { onReplay: () => void }) {
  return <main className="scene chapter-end-screen">
    <SceneArt asset={assetManifest.backgrounds.spaceStars} className="space-sky"/>
    <div className="end-copy">
      <AsterMark/>
      <h1>Chapter 01 Complete</h1>
      <h2>Where It All Began</h2>
      <p>To be continued...</p>
      <p>Next destination: Mars</p>
      <button onClick={onReplay}>Replay Chapter</button>
    </div>
  </main>;
}
