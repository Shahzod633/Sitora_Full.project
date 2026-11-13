import React from 'react';
import './CreditsPanel.css';
import { archivePhotos, assets, publicUrl, type AssetDef } from '../../data/assetManifest';

export default function CreditsPanel({ onClose }: { onClose: () => void }) {
  const ref = React.useRef<HTMLDialogElement>(null);
  React.useLayoutEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  const temporary = Object.values<AssetDef>(assets).filter(a => a.status === 'temporary').length;

  return <dialog className="credits-panel" ref={ref} aria-labelledby="credits-title"
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === ref.current) onClose(); }}>
    <h2 id="credits-title">Credits &amp; Sources</h2>
    <section>
      <h3>ASTER — Abandoned But Not Forgotten</h3>
      <p>Chapter 01, “Where It All Began”. Original story, characters and screenplay by the ASTER team.</p>
      <p className="credits-note">Work in progress: {temporary} illustrations in this build are temporary placeholders
        that the ASTER art team is replacing with final artwork.</p>
    </section>
    <section>
      <h3>Sound</h3>
      <p>Character voice blips and story sound cues are synthesized in your browser (original).</p>
    </section>
    <section>
      <h3>Historical sources</h3>
      <ul>
        <li><a href="https://www.nasa.gov/mission/apollo-11/" target="_blank" rel="noreferrer">NASA — Apollo 11 mission</a></li>
        <li><a href="https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11.html" target="_blank" rel="noreferrer">NASA NSSDC — Apollo 11 archive</a></li>
        <li>NASA (2011), “Recommendations to Space-Faring Entities: How to Protect and Preserve the Historic and
          Scientific Value of U.S. Government Lunar Artifacts”.</li>
        {archivePhotos.map(p => <li key={p.nasaId}>
          {p.nasaId}: {p.credit}{p.available ? '' : ' (image pending)'} — <a href={p.source} target="_blank" rel="noreferrer">catalogue</a>
        </li>)}
      </ul>
      <p className="credits-note">Apollo 11 information is documented history. Aster, its crew, the lunar base and all
        future events are fiction. The first-step animation is an illustrated reconstruction, not archival footage.</p>
    </section>
    <section>
      <h3>Typefaces and data</h3>
      <ul>
        <li>Barlow Condensed — SIL Open Font License 1.1 (<a href={publicUrl('assets/fonts/OFL.txt')} target="_blank" rel="noreferrer">license</a>)</li>
        <li>Earth illustration coastlines — Natural Earth (public domain)</li>
      </ul>
    </section>
    <button type="button" className="close-button" onClick={onClose} autoFocus>Close</button>
  </dialog>;
}
