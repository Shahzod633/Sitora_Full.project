import React from 'react';
import { useAudio } from '../../../components/audio/AudioContext';
import { useStoryActions } from '../../../story/StoryActions';
import type { FxProps } from '../../../story/fxRegistry';
import { SOL_NOTE, pathfinder } from '../../../data/missions';

// Sequence 7 — the Mars Pathfinder mission timeline. Events arrive one after another along a line and the
// planned-versus-actual bars fill to scale (7 of 83 sols). The reader can step ahead or leave at any time.

const STEP_MS = 1900;

export default function MissionTimeline({ id }: FxProps) {
  const { interactionTarget, interact, paused } = useStoryActions();
  const { playCue } = useAudio();
  const live = interactionTarget === id;
  const total = pathfinder.events.length;
  const reduced = React.useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const [shown, setShown] = React.useState(reduced ? total : 0);
  const complete = shown >= total;

  React.useEffect(() => {
    if (!live || paused || complete) return;
    const timer = window.setTimeout(() => {
      setShown(n => n + 1);
      playCue('tick');
    }, shown === 0 ? 700 : STEP_MS);
    return () => window.clearTimeout(timer);
  }, [live, paused, complete, shown, playCue]);

  const { planned, actual } = pathfinder;
  return <section className="activity mission-timeline" data-active={live} data-complete={complete} data-no-advance aria-labelledby="timeline-title">
    <header className="timeline-head">
      <p className="archive-kicker"><span className="archive-badge">Documented history</span> NASA mission record</p>
      <h2 id="timeline-title">Mars Pathfinder: the mission timeline</h2>
    </header>

    <ol className="timeline-track">
      {pathfinder.events.map((event, i) =>
        <li key={event.title} className="timeline-event" data-shown={i < shown} data-final={i === total - 1}>
          <span className="timeline-dot" aria-hidden="true"/>
          <p className="timeline-date">{event.date}{event.sol !== undefined && <span> · Sol {event.sol}</span>}</p>
          <h3>{event.title}</h3>
          <p>{event.text}</p>
        </li>)}
    </ol>

    <div className="timeline-compare" data-shown={shown >= 5}>
      <div className="compare-row">
        <span className="compare-label">{planned.label}</span>
        <span className="compare-bar"><i style={{ '--fill': planned.sols / actual.sols } as React.CSSProperties}/></span>
        <strong>{planned.sols} sols</strong>
      </div>
      <div className="compare-row is-actual" data-shown={complete}>
        <span className="compare-label">{actual.label}</span>
        <span className="compare-bar"><i style={{ '--fill': 1 } as React.CSSProperties}/></span>
        <strong>{actual.sols} sols</strong>
      </div>
      <p className="compare-note">
        {SOL_NOTE} {actual.sols} sols are about {pathfinder.earthDays} Earth days: almost twelve times the plan.
      </p>
    </div>

    <ul className="timeline-totals" data-shown={complete}>
      {pathfinder.totals.map(item => <li key={item.label}><strong>{item.value}</strong> {item.label}</li>)}
    </ul>

    <footer className="timeline-foot">
      <p className="archive-sources">Sources: {pathfinder.sources.map((source, i) => <React.Fragment key={source.url}>
        {i > 0 && ' · '}<a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
      </React.Fragment>)}</p>
      <div className="timeline-actions">
        {!complete && <button type="button" className="activity-button is-quiet" onClick={() => setShown(total)} disabled={!live}>Show everything</button>}
        <button type="button" className="activity-button" onClick={() => interact(id)} disabled={!live}>Return to the present</button>
      </div>
    </footer>
    <p className="sr-only" role="status">{shown > 0 && shown <= total ? `${pathfinder.events[shown - 1].date}: ${pathfinder.events[shown - 1].title}` : ''}</p>
  </section>;
}
