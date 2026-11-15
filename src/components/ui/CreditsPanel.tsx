import React from 'react';
import './CreditsPanel.css';
import {
  apolloLrvPhoto, archivePhotos, lunokhodModelPhoto, lunokhodOrbitPhoto, pathfinderPhotos,
  reflectorPhoto, roverPhotos, type ArchivePhoto,
} from '../../data/assetManifest';
import { sources } from '../../data/missions';

export default function CreditsPanel({ onClose, onProjectDetails }: { onClose: () => void; onProjectDetails: () => void }) {
  const ref = React.useRef<HTMLDialogElement>(null);
  React.useLayoutEffect(() => {
    const dialog = ref.current!;
    // Focus returns to whatever opened the panel once it closes.
    const opener = document.activeElement as HTMLElement | null;
    // Older mobile browsers have no modal <dialog>: fall back to a plain open dialog (styled as an overlay).
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    return () => {
      if (typeof dialog.close === 'function' && dialog.open) dialog.close();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);
  const photos = new Map<string, ArchivePhoto>();
  // NASA mission imagery stays here even when a partner hosts it. The Wikimedia museum photo is separate.
  [...archivePhotos, reflectorPhoto, lunokhodOrbitPhoto, apolloLrvPhoto,
    ...pathfinderPhotos, ...Object.values(roverPhotos)].forEach(p => photos.set(p.nasaId, p));

  // Only a click on the backdrop closes the panel. The dialog element has no padding of its own, so taps on the
  // blank space between paragraphs land on the body below and never dismiss the panel by accident.
  return <dialog className="credits-panel" ref={ref} aria-labelledby="credits-title" data-no-advance
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { event.stopPropagation(); if (event.target === ref.current) onClose(); }}>
    <div className="credits-body">
    <header className="credits-head">
      <h2 id="credits-title">Credits &amp; Sources</h2>
      <button type="button" className="credits-close" aria-label="Close credits" onClick={onClose} autoFocus>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
    </header>
    <div className="credits-scroll">
    <section>
      <p>Sources of the historical information, archive images and geographic data used in ASTER.</p>
      <button type="button" className="close-button" onClick={onProjectDetails}>Project Details</button>
      <p className="credits-note">Authorship, development tools and AI / SI assistance are described in Project Details.</p>
    </section>
    <section>
      <h3>NASA Data</h3>
      <p>Mission histories, dates and scientific findings used in the lunar archive, Mars Pathfinder panels
        and rover timeline.</p>
      <ul>
        {Object.values(sources).map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label}</a></li>)}
        <li><a href="https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11.html" target="_blank" rel="noreferrer">NASA NSSDC — Apollo 11 archive</a></li>
        <li><a href="https://ilrs.cddis.eosdis.nasa.gov/missions/satellite_missions/current_missions/ap11_general.html" target="_blank" rel="noreferrer">NASA ILRS — Apollo 11 laser retroreflector</a> — lunar archive.</li>
        <li><a href="https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html" target="_blank" rel="noreferrer">NASA NSSDC — Lunar Roving Vehicle</a> — lunar archive.</li>
        <li><a href="https://www.nasa.gov/wp-content/uploads/static/history/SP-4029/Apollo_15a_Summary.htm" target="_blank" rel="noreferrer">NASA — Apollo 15 mission summary</a> — distance travelled and samples returned.</li>
        <li>NASA (2011), “Recommendations to Space-Faring Entities: How to Protect and Preserve the Historic and
          Scientific Value of U.S. Government Lunar Artifacts”.</li>
      </ul>
      <h4>NASA mission imagery</h4>
      <ul>
        {[...photos.values()].map(p => <li key={p.nasaId}>
          <a href={p.source} target="_blank" rel="noreferrer">{p.caption}</a> — {p.credit}{p.available ? '' : ' (image pending)'}
        </li>)}
      </ul>
    </section>
    <section>
      <h3>Space Agency &amp; Other</h3>
      <p>Non-NASA materials used in the lunar archive and the Earth illustration.</p>
      <ul>
        <li><a href={lunokhodModelPhoto.source} target="_blank" rel="noreferrer">Wikimedia Commons — Lunokhod 1 model</a>
          {' '}— {lunokhodModelPhoto.credit}. Used in the Chapter 01 lunar hardware archive.</li>
        <li><a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth — map data</a>
          {' '}— public-domain coastline geometry used in the project’s fallback Earth illustration.</li>
      </ul>
    </section>
    <button type="button" className="close-button" onClick={onClose}>Close</button>
    </div>
    </div>
  </dialog>;
}
