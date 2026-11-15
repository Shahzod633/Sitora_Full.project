import React from 'react';
import '../../../components/ui/HistoricalInfoPanel.css';
import ArchivePhotoFigure from '../../../components/archive/ArchivePhotoFigure';
import SceneArt from '../../../components/visual/SceneArt';
import { useAudio } from '../../../components/audio/AudioContext';
import { useStoryActions } from '../../../story/StoryActions';
import type { FxProps } from '../../../story/fxRegistry';
import { roverPhotos, type AssetId } from '../../../data/assetManifest';
import { STATUS_CHECKED, roverTimeline, type RoverEntry } from '../../../data/missions';

// Interaction D — the rover timeline. Four entries (1997, 2004, 2012, 2021) the reader can open in any
// order with a click, a tap or the arrow keys. Nothing has to be read: "Continue the story" is always
// available, and the optional detail sits behind "More about this mission".

const HOLO: Record<RoverEntry['id'], AssetId[]> = {
  sojourner: ['holoSojourner'],
  mer: ['holoSpirit', 'holoOpportunity'],
  curiosity: ['holoCuriosity'],
  perseverance: ['holoPerseverance'],
};

export default function RoverTimeline({ id }: FxProps) {
  const { interactionTarget, interact } = useStoryActions();
  const { playCue } = useAudio();
  const live = interactionTarget === id;
  const [index, setIndex] = React.useState(0);
  const [seen, setSeen] = React.useState<ReadonlySet<number>>(() => new Set([0]));
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const entry = roverTimeline[index];

  const last = roverTimeline.length - 1;
  const select = (next: number, focus = false) => {
    const target = (next + roverTimeline.length) % roverTimeline.length;
    setIndex(target);
    setSeen(previous => new Set(previous).add(target));
    playCue('tick');
    if (focus) tabs.current[target]?.focus();
  };
  // The "Next mission" button walks forward through the timeline and stops at the last entry (it is disabled
  // there); the arrow keys on the tablist still wrap, which is the expected tablist behaviour.
  const nextMission = () => { if (index < last) select(index + 1); };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); select(index + 1, true); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); select(index - 1, true); }
    else if (e.key === 'Home') { e.preventDefault(); select(0, true); }
    else if (e.key === 'End') { e.preventDefault(); select(roverTimeline.length - 1, true); }
  };

  return <section className="activity rover-timeline" data-active={live} data-no-advance data-keys aria-labelledby="rover-timeline-title">
    <header className="timeline-head">
      <p className="archive-kicker"><span className="archive-badge">Documented history</span> NASA Mars rovers · 1997–today</p>
      <h2 id="rover-timeline-title">Those who came after</h2>
    </header>

    <div className="rover-tabs" role="tablist" aria-label="Mars rover missions" onKeyDown={onKey}>
      {roverTimeline.map((rover, i) =>
        <button key={rover.id} ref={el => { tabs.current[i] = el; }} type="button" role="tab" id={`rover-tab-${rover.id}`}
          aria-selected={i === index} aria-controls="rover-panel" tabIndex={i === index ? 0 : -1} data-seen={seen.has(i)}
          onClick={() => select(i)}>
          <span className="rover-tab-year">{rover.year}</span>
          <span className="rover-tab-name">{rover.name}</span>
        </button>)}
    </div>

    <div className="rover-panel" role="tabpanel" id="rover-panel" aria-labelledby={`rover-tab-${entry.id}`} key={entry.id}>
      <div className="rover-visual">
        <div className="rover-holo" aria-hidden="true">
          {HOLO[entry.id].map(asset => <span key={asset} className="holo-model"><SceneArt asset={asset} className="holo-art"/></span>)}
        </div>
        <ArchivePhotoFigure photo={roverPhotos[entry.id]} compact/>
      </div>
      <div className="rover-text">
        <p className="rover-mission">{entry.mission} · {entry.year}</p>
        <h3>{entry.name}</h3>
        <p className="rover-summary">{entry.summary}</p>
        <ul>{entry.achievements.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="rover-status" data-state={entry.status.state}>
          <span>{entry.status.state === 'active' ? 'Active' : 'Ended'}</span> {entry.status.text}
          {entry.status.state === 'active' && <small> Status checked {STATUS_CHECKED}.</small>}
        </p>
        <details>
          <summary>More about this mission</summary>
          <p>{entry.more}</p>
        </details>
        <p className="archive-sources">Source: <a href={entry.source.url} target="_blank" rel="noreferrer">{entry.source.label}</a></p>
      </div>
    </div>

    <footer className="timeline-foot">
      <p className="rover-progress" role="status">{seen.size} of {roverTimeline.length} missions explored</p>
      <div className="timeline-actions">
        <button type="button" className="activity-button is-quiet" onClick={nextMission} disabled={!live || index === last}>Next mission</button>
        <button type="button" className="activity-button" onClick={() => interact(id)} disabled={!live}>Continue the story</button>
      </div>
    </footer>
  </section>;
}
