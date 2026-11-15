import React from 'react';
import './HistoricalInfoPanel.css';
import ArchivePhotoFigure from '../archive/ArchivePhotoFigure';
import {
  apolloLrvPhoto, archivePhotos, lunokhodModelPhoto, lunokhodOrbitPhoto, reflectorPhoto,
} from '../../data/assetManifest';
import { useStoryActions } from '../../story/StoryActions';

// Chapter 1 lunar hardware archive. Three documented records, navigated with Back / Next (and the keyboard
// arrows); every page is reachable without reading the previous ones. On the last record Continue calls
// interact('archivePanel') so the Director advances the story. Every claim is sourced; the two Soviet mission
// photos are labelled independently of the NASA image credit so attribution stays clean.

type Record = { id: string; label: string };
const RECORDS: Record[] = [
  { id: 'apollo11', label: '1969 · Apollo 11 · Tranquility Base' },
  { id: 'lunokhod', label: '1970 · Lunokhod 1 · Luna 17' },
  { id: 'lrv', label: '1971–1972 · NASA Apollo Lunar Roving Vehicles' },
];

type PageProps = { onContinue: () => void; onBack?: () => void; onSkip?: () => void; label: string; index: number; total: number };

function Progress({ index, total }: { index: number; total: number }) {
  return <ol className="archive-progress" aria-label={`Record ${index + 1} of ${total}`}>
    {RECORDS.map((r, i) => <li key={r.id} data-state={i < index ? 'past' : i === index ? 'current' : 'future'} aria-current={i === index ? 'step' : undefined}>
      <span className="sr-only">{r.label}</span>
    </li>)}
  </ol>;
}

/** The record the archive originally held: Apollo 11, now with a short section on the laser reflector. */
function Apollo11Record({ onContinue, label, index, total }: PageProps) {
  return <section className="archive-panel" aria-labelledby="apollo-history-title" data-no-advance>
    <header className="archive-head">
      <p className="archive-kicker"><span className="archive-badge">Documented history</span> {label}</p>
      <h2 id="apollo-history-title">Apollo 11: the first crewed Moon landing</h2>
      <Progress index={index} total={total}/>
    </header>
    <div className="archive-body">
      <div className="archive-text">
        <p className="archive-lead">
          On 20 July 1969 the lunar module <em>Eagle</em> landed in the Sea of Tranquility. Neil Armstrong and
          Buzz Aldrin became the first people to walk on the Moon, while Michael Collins orbited above in the
          command module <em>Columbia</em>.
        </p>
        <dl className="archive-facts">
          <div><dt>Launch</dt><dd>16 July 1969, Kennedy Space Center</dd></div>
          <div><dt>Landing</dt><dd>20 July 1969, 20:17 UTC, Tranquility Base</dd></div>
          <div><dt>First step</dt><dd>Neil Armstrong, 21 July 1969, 02:56 UTC</dd></div>
          <div><dt>Return</dt><dd>Splashdown in the Pacific Ocean, 24 July 1969</dd></div>
        </dl>
        <h3 className="archive-subhead">The laser retroreflector</h3>
        <p>
          Apollo 11 left a passive reflector at Tranquility Base. Scientists on Earth aim a laser pulse at it
          and time the faint light that comes back. That round-trip time tells them how far away the Moon is.
        </p>
        <p>
          When the astronauts left, <em>Eagle</em>’s descent stage served as the launch platform for the ascent
          stage and stayed behind. It still stands at Tranquility Base.
        </p>
      </div>
      <div className="archive-photos">
        {archivePhotos.map(photo => <ArchivePhotoFigure key={photo.nasaId} photo={photo}/>)}
      </div>
    </div>
    <ArchivePhotoFigure photo={reflectorPhoto} compact/>
    <footer className="archive-foot">
      <p className="archive-sources">
        Sources: <a href="https://www.nasa.gov/mission/apollo-11/" target="_blank" rel="noreferrer">NASA: Apollo 11</a>
        {' · '}<a href="https://ilrs.cddis.eosdis.nasa.gov/missions/satellite_missions/current_missions/ap11_general.html" target="_blank" rel="noreferrer">NASA ILRS: Apollo 11 reflector</a>
        {' · '}<a href="https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11.html" target="_blank" rel="noreferrer">NASA NSSDC Apollo 11 archive</a>
      </p>
      <div className="archive-actions">
        <button type="button" className="archive-button is-primary" onClick={onContinue} autoFocus>Next: Lunokhod 1</button>
      </div>
    </footer>
  </section>;
}

/** Historical context card: Lunokhod 1 (Soviet Luna 17), with its reflector. Clearly labelled as context. */
function LunokhodRecord({ onContinue, onBack, onSkip, label, index, total }: PageProps) {
  return <section className="archive-panel" aria-labelledby="lunokhod-title" data-no-advance>
    <header className="archive-head">
      <p className="archive-kicker"><span className="archive-badge is-context">Historical context</span> {label}</p>
      <h2 id="lunokhod-title">Lunokhod 1 — Soviet Luna 17 mission</h2>
      <Progress index={index} total={total}/>
    </header>
    <div className="archive-body">
      <div className="archive-text">
        <p className="archive-lead">
          In November 1970, the Soviet Luna 17 mission delivered Lunokhod 1 to Mare Imbrium. Operators on Earth
          drove the robot across the lunar surface. It carried a French-built laser reflector. Decades later,
          images from NASA’s Lunar Reconnaissance Orbiter helped scientists locate the rover and use the
          reflector again.
        </p>
        <dl className="archive-facts">
          <div><dt>Delivered by</dt><dd>Luna 17 (Soviet Union), Nov 1970</dd></div>
          <div><dt>Landed at</dt><dd>Mare Imbrium (Sea of Rains)</dd></div>
          <div><dt>Operated</dt><dd>Remotely, from Earth</dd></div>
          <div><dt>Carried</dt><dd>A French-built passive laser reflector</dd></div>
        </dl>
      </div>
      <div className="archive-photos is-two">
        <ArchivePhotoFigure photo={lunokhodModelPhoto}/>
        <ArchivePhotoFigure photo={lunokhodOrbitPhoto}/>
      </div>
    </div>
    <footer className="archive-foot">
      <p className="archive-sources">
        Sources: <a href="https://commons.wikimedia.org/wiki/File:Lunokhod-1_model.jpg" target="_blank" rel="noreferrer">Wikimedia: Lunokhod 1 model</a>
        {' · '}<a href="https://lroc.im-ldi.com/images/402" target="_blank" rel="noreferrer">LROC: Lunokhod 1 at its parking spot</a>
      </p>
      <div className="archive-actions">
        {onBack && <button type="button" className="archive-button is-quiet" onClick={onBack}>Back</button>}
        {onSkip && <button type="button" className="archive-button is-quiet" onClick={onSkip}>Skip to Apollo lunar rovers</button>}
        <button type="button" className="archive-button is-primary" onClick={onContinue} autoFocus>Next: Apollo lunar rovers</button>
      </div>
    </footer>
  </section>;
}

/** NASA's crew-driven Apollo Lunar Roving Vehicles (1971–1972). Main screen with the largest image. */
function LrvRecord({ onContinue, onBack, label, index, total }: PageProps) {
  return <section className="archive-panel is-main" aria-labelledby="lrv-title" data-no-advance>
    <header className="archive-head">
      <p className="archive-kicker"><span className="archive-badge">Documented history</span> {label}</p>
      <h2 id="lrv-title">NASA’s Apollo Lunar Roving Vehicles</h2>
      <Progress index={index} total={total}/>
    </header>
    <div className="archive-body is-hero">
      <div className="archive-text">
        <p className="archive-lead">
          In 1971, Apollo 15 astronauts drove a battery-powered Lunar Roving Vehicle at Hadley–Apennine. It
          helped them reach more sites, carry equipment and return with samples. The crew drove about
          <strong> 28 km</strong> and collected about <strong>77 kg</strong> of rocks and soil over the mission.
          The rover stayed on the Moon.
        </p>
        <ol className="archive-timeline" aria-label="Apollo Lunar Roving Vehicle missions">
          <li><strong>Apollo 15</strong> <span>1971</span><p>First NASA Apollo mission to use a Lunar Roving Vehicle.</p></li>
          <li><strong>Apollo 16</strong> <span>1972</span><p>Another crew-driven Lunar Roving Vehicle.</p></li>
          <li><strong>Apollo 17</strong> <span>1972</span><p>Another crew-driven Lunar Roving Vehicle.</p></li>
        </ol>
      </div>
      <ArchivePhotoFigure photo={apolloLrvPhoto}/>
    </div>
    <footer className="archive-foot">
      <p className="archive-sources">
        Sources: <a href="https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html" target="_blank" rel="noreferrer">NASA NSSDC: Apollo LRV overview</a>
        {' · '}<a href="https://www.nasa.gov/wp-content/uploads/static/history/SP-4029/Apollo_15a_Summary.htm" target="_blank" rel="noreferrer">NASA SP-4029: Apollo 15 summary</a>
      </p>
      <div className="archive-actions">
        {onBack && <button type="button" className="archive-button is-quiet" onClick={onBack}>Back</button>}
        <button type="button" className="archive-button is-primary" onClick={onContinue} autoFocus>Return to the present</button>
      </div>
    </footer>
  </section>;
}

export default function HistoricalInfoPanel() {
  const { interact, interactionTarget } = useStoryActions();
  const [index, setIndex] = React.useState(0);
  const done = React.useCallback(() => {
    // Only advance if this panel is the active interaction (prevents stray presses outside the archive beat).
    if (interactionTarget === 'archivePanel') interact('archivePanel');
  }, [interact, interactionTarget]);

  const page: PageProps = {
    label: RECORDS[index].label,
    index, total: RECORDS.length,
    onContinue: () => (index === RECORDS.length - 1 ? done() : setIndex(index + 1)),
    onBack: index > 0 ? () => setIndex(index - 1) : undefined,
    onSkip: index === 1 ? () => setIndex(2) : undefined,
  };

  // Keyboard inside the panel: Left = Back, Right = Next (when the user is not typing).
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current!;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowLeft' && page.onBack) { e.stopPropagation(); e.preventDefault(); page.onBack(); }
      else if (e.key === 'ArrowRight') { e.stopPropagation(); e.preventDefault(); page.onContinue(); }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [page]);

  return <div ref={ref} className="archive-shell" data-keys data-no-advance>
    {index === 0 && <Apollo11Record {...page}/>}
    {index === 1 && <LunokhodRecord {...page}/>}
    {index === 2 && <LrvRecord {...page}/>}
    <p className="sr-only" role="status">{`Record ${index + 1} of ${RECORDS.length}: ${RECORDS[index].label}`}</p>
  </div>;
}
