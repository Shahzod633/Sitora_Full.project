import React from 'react';
import './PauseMenu.css';
import SoundSettings from '../audio/SoundSettings';
import { chapterList } from '../../chapters';

type Props = {
  open: boolean;
  onPause: () => void;
  onResume: () => void;
  currentChapter: string;
  onRestart: () => void;
  onSelectChapter: (index: number) => void;
  onTitle: () => void;
  onCredits: () => void;
};

// Pause button (always on screen) and the pause menu: resume, restart the chapter, jump to a chapter,
// sound settings, credits. Opening it freezes the story; Escape or Resume continues exactly where it stopped.
export default function PauseMenu({ open, onPause, onResume, currentChapter, onRestart, onSelectChapter, onTitle, onCredits }: Props) {
  const dialog = React.useRef<HTMLDialogElement>(null);
  const opener = React.useRef<HTMLButtonElement>(null);

  React.useLayoutEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) {
      el.close();
      opener.current?.focus({ preventScroll: true });
    }
  }, [open]);

  return <>
    <button ref={opener} type="button" className="pause-button" aria-label="Pause and open the menu" title="Pause (Esc)"
      onClick={e => { e.stopPropagation(); onPause(); }}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z"/></svg>
    </button>
    <dialog ref={dialog} className="pause-menu" aria-labelledby="pause-title" data-no-advance
      onCancel={e => { e.preventDefault(); onResume(); }}
      onClick={e => { e.stopPropagation(); if (e.target === dialog.current) onResume(); }}>
      {open && <div className="pause-body">
        <p className="pause-kicker">Paused</p>
        <h2 id="pause-title">ASTER</h2>
        <div className="pause-actions">
          <button type="button" className="begin-button" onClick={onResume} autoFocus>Resume</button>
          <button type="button" className="text-button" onClick={onRestart}>Restart chapter</button>
        </div>
        <section aria-labelledby="pause-chapters">
          <h3 id="pause-chapters">Chapters</h3>
          <ol className="chapter-list">
            {chapterList.map((entry, i) => <li key={entry.id}>
              <button type="button" aria-current={entry.id === currentChapter ? 'true' : undefined} onClick={() => onSelectChapter(i)}>
                <span className="chapter-list-number">{entry.number}</span>
                <span className="chapter-list-title">{entry.title}<small>{entry.place}</small></span>
              </button>
            </li>)}
          </ol>
        </section>
        <section aria-labelledby="pause-sound">
          <h3 id="pause-sound">Sound</h3>
          <SoundSettings/>
        </section>
        <div className="pause-footer">
          <button type="button" className="text-button" onClick={onCredits}>Credits &amp; Sources</button>
          <button type="button" className="text-button" onClick={onTitle}>Back to title</button>
        </div>
      </div>}
    </dialog>
  </>;
}
