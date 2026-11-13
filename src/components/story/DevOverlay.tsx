import React from 'react';
import { gsap } from 'gsap';
import type { Director, Snapshot } from '../../story/Director';
import { validateChapter } from '../../story/validate';

// Development-only storyboard overlay. Imported lazily behind import.meta.env.DEV, so production
// builds never include it. Toggle with the ` key. Jump with [ and ], or the beat list.
export default function DevOverlay({ director, snap }: { director: Director; snap: Snapshot }) {
  const chapter = director.chapter;
  const [open, setOpen] = React.useState(true);
  const problems = React.useMemo(() => validateChapter(chapter), [chapter]);

  React.useEffect(() => {
    problems.forEach(p => console.warn(`[storyboard] ${p}`));
    // Test hooks for browser automation (development builds only).
    Object.assign(window, { __aster: director, __gsap: gsap });
  }, [problems, director]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '`') setOpen(o => !o);
      if (e.key === '[') director.jump(snap.beatIndex - 1);
      if (e.key === ']') director.jump(snap.beatIndex + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [director, snap.beatIndex]);

  if (!open) return null;
  const { beat } = snap;
  const lines = beat.dialogue?.length ?? 0;
  return <aside className="dev-overlay" data-no-advance onClick={e => e.stopPropagation()}>
    <strong>SEQ {beat.sequence} · {beat.id}</strong> <span>{beat.slug}</span>
    <span>{chapter.sequences[beat.sequence]} · stage {beat.stage} · {snap.phase}{lines ? ` · line ${snap.lineIndex + 1}/${lines}` : ''}</span>
    <span className="dev-controls">
      <button type="button" onClick={() => director.jump(snap.beatIndex - 1)} aria-label="Previous beat">◀</button>
      <select value={snap.beatIndex} onChange={e => director.jump(Number(e.target.value))} aria-label="Jump to beat">
        {chapter.beats.map((b, i) => <option key={b.id} value={i}>{b.id} {b.title}</option>)}
      </select>
      <button type="button" onClick={() => director.jump(snap.beatIndex + 1)} aria-label="Next beat">▶</button>
    </span>
    <span className={problems.length ? 'dev-bad' : 'dev-ok'}>
      {problems.length ? `${problems.length} storyboard problem(s) — see console` : `storyboard valid · ${chapter.beats.length} beats`}
    </span>
  </aside>;
}
