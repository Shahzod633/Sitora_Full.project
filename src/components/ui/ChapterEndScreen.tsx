import React from 'react';
import './ChapterEndScreen.css';
import { AsterMark } from '../visual/ChapterFrame';

// Beat 33 end card, rendered inside the ending stage after the fade to black.
export default function ChapterEndCard({ onReplay, onCredits }: { onReplay: () => void; onCredits: () => void }) {
  return <div className="end-copy" data-no-advance>
    <AsterMark/>
    <h1>Chapter 01 Complete</h1>
    <h2>Where It All Began</h2>
    <p className="end-continued">To be continued...</p>
    <p className="end-next">Next destination: <strong>Mars</strong></p>
    <div className="end-actions">
      <button type="button" className="end-replay" onClick={onReplay}>Replay Chapter</button>
      <button type="button" className="text-button" onClick={onCredits}>Credits &amp; Sources</button>
    </div>
  </div>;
}
