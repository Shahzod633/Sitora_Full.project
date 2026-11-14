import React from 'react';
import SceneArt from '../../../components/visual/SceneArt';
import { AsterMark } from '../../../components/visual/ChapterFrame';
import { useStoryActions } from '../../../story/StoryActions';
import { archivePhotos, publicUrl, roverPhotos, type ArchivePhoto, type AssetId } from '../../../data/assetManifest';
import { legacyMilestones } from '../../../data/missions';

/** The crew display. The authorization is part of the fiction, and the card says so. */
export function CrewDisplay() {
  return <span className="crew-display" role="status">
    <span className="crew-display-system">Aster expedition · crew display</span>
    <strong>Heritage Recovery Authorized</strong>
    <span className="crew-display-dest">Destination: Mars Colony Museum</span>
    <small>Fictional future authorization — not a NASA policy or procedure</small>
  </span>;
}

// Illustration shown for a milestone until its NASA photograph has been added to the build.
const ART: Record<string, AssetId> = {
  apollo11: 'apolloPainting', sojourner: 'sojourner', spirit: 'holoSpirit', opportunity: 'holoOpportunity',
  curiosity: 'holoCuriosity', perseverance: 'holoPerseverance', aster: 'asterSpace',
};
const photoFor = (nasaId?: string): ArchivePhoto | undefined =>
  nasaId ? [...archivePhotos, ...Object.values(roverPhotos)].find(p => p.nasaId === nasaId && p.available) : undefined;

/** Seven moments joined by a glowing line. `--p` (0–7) on the layer is how far the line has travelled. */
export function LegacyLine() {
  const { portrait } = useStoryActions();
  const n = legacyMilestones.length;
  // The line climbs from Apollo 11 (bottom left) to the Aster expedition (top right); upright phones stack it.
  const points = legacyMilestones.map((_, i) => portrait
    ? { x: i % 2 ? 68 : 32, y: 88 - (i * 76) / (n - 1) }
    : { x: 8 + (i * 84) / (n - 1), y: 70 - (i * 34) / (n - 1) });
  return <div className="legacy-line" data-portrait={portrait} role="img"
    aria-label="Apollo 11, Sojourner, Spirit, Opportunity, Curiosity, Perseverance and, finally, the fictional Aster expedition, connected by a glowing line">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polyline className="legacy-path" points={points.map(p => `${p.x},${p.y}`).join(' ')}/>
    </svg>
    {legacyMilestones.map((m, i) => {
      const photo = photoFor(m.photo);
      return <div key={m.id} className={`legacy-node${'fiction' in m ? ' is-fiction' : ''}`}
        style={{ left: `${points[i].x}%`, top: `${points[i].y}%`, '--i': i } as React.CSSProperties}>
        <span className="legacy-thumb">
          {photo ? <img src={publicUrl(photo.file)} alt=""/> : <SceneArt asset={ART[m.id]} className="legacy-art"/>}
        </span>
        <span className="legacy-dot"/>
        <span className="legacy-label"><strong>{m.name}</strong>{m.year}{'fiction' in m && <em>Fiction</em>}</span>
      </div>;
    })}
  </div>;
}

/** The last card: the title, THE END, replay and credits. */
export function FinalTitle() {
  const { ended, replayStory, credits } = useStoryActions();
  const replay = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (!ended) return;
    const timer = window.setTimeout(() => replay.current?.focus({ preventScroll: true }), 5200);
    return () => window.clearTimeout(timer);
  }, [ended]);
  if (!ended) return null;
  return <div className="final-title" data-no-advance>
    <AsterMark/>
    <h1>Abandoned But Not Forgotten</h1>
    <p className="final-end">The End</p>
    <div className="end-actions">
      <button ref={replay} type="button" className="end-replay" onClick={replayStory}>Replay the Story</button>
      <button type="button" className="text-button" onClick={credits}>Credits &amp; Sources</button>
    </div>
  </div>;
}
