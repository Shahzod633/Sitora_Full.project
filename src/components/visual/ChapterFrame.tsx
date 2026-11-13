import React from 'react';
import type { Caption, SequenceId } from '../../story/types';

export function AsterMark() {
  return <svg className="aster-mark" viewBox="0 0 44 44" fill="none" aria-hidden="true">
    <path d="m22 2 3.4 14.7L38 12l-9.8 10L42 25l-15.8 2.1L22 42l-3.9-15L3 22l14.2-3.9L13 7l7.2 9.3z" fill="currentColor"/>
    <circle cx="22" cy="22" r="3.1" fill="#183139"/>
  </svg>;
}

type Props = {
  number: string;
  title: string;
  sequences: Record<SequenceId, string>;
  current: SequenceId;
  hidden?: boolean;
};

/** Masthead and a quiet six-part progress meter (one tick per storyboard sequence). */
export default function ChapterFrame({ number, title, sequences, current, hidden }: Props) {
  const ids = Object.keys(sequences) as SequenceId[];
  const index = ids.indexOf(current);
  return <div className="chapter-frame" data-hidden={hidden}>
    <header className="chapter-mast">
      <div className="wordmark"><AsterMark/><span>ASTER</span></div>
      <div className="chapter-name"><span>Chapter {number}</span> {title}</div>
    </header>
    <div className="sequence-progress" role="img" aria-label={`Part ${index + 1} of ${ids.length}: ${sequences[current]}`}>
      {ids.map((id, i) => <i key={id} data-state={i < index ? 'past' : i === index ? 'current' : 'future'}/>)}
    </div>
  </div>;
}

/** Comic-style captions for the current beat. Scene titles fade out on their own. */
export function Captions({ captions, beatId }: { captions: Caption[]; beatId: string }) {
  if (!captions.length) return null;
  return <div className="captions" key={beatId}>
    {captions.map((caption, i) =>
      <p key={i} className={`caption caption-${caption.kind}`} style={{ '--i': i } as React.CSSProperties}>{caption.text}</p>)}
  </div>;
}
