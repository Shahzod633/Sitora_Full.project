import React from 'react';
import './ChapterEndScreen.css';
import { AsterMark } from '../visual/ChapterFrame';
import { useStoryActions } from '../../story/StoryActions';

// Chapter-complete card, rendered inside a chapter's ending stage after the fade to black.
// Text comes from the chapter's `ending`; the primary action continues the story when there is a next chapter.
export default function ChapterEndCard() {
  const { chapter, next, replay, credits } = useStoryActions();
  const ending = chapter?.ending;
  const primary = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    // Keyboard readers land on the way forward once the card has faded in.
    const id = window.setTimeout(() => primary.current?.focus({ preventScroll: true }), 3200);
    return () => window.clearTimeout(id);
  }, []);
  if (!chapter || !ending) return null;
  return <div className="end-copy" data-no-advance>
    <AsterMark/>
    <h1>{ending.kicker}</h1>
    <h2>{ending.title}</h2>
    {ending.note && <p className="end-continued">{ending.note}</p>}
    {ending.nextLabel && <p className="end-next">{ending.nextLabel}: <strong>{ending.nextValue}</strong></p>}
    <div className="end-actions">
      {next && <button ref={primary} type="button" className="end-replay end-continue" onClick={next}>
        Continue to Chapter {chapter.nextNumber}
      </button>}
      <button ref={next ? undefined : primary} type="button" className={next ? 'text-button' : 'end-replay'} onClick={replay}>Replay Chapter</button>
      <button type="button" className="text-button" onClick={credits}>Credits &amp; Sources</button>
    </div>
  </div>;
}
