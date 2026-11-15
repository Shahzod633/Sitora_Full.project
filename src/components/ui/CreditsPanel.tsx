import React from 'react';
import './CreditsPanel.css';
import {
  apolloLrvPhoto, archivePhotos, assets, lunokhodModelPhoto, lunokhodOrbitPhoto, pathfinderPhotos,
  publicUrl, reflectorPhoto, roverPhotos, type ArchivePhoto, type AssetDef,
} from '../../data/assetManifest';
import { sources } from '../../data/missions';

export default function CreditsPanel({ onClose }: { onClose: () => void }) {
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
  const temporary = Object.values<AssetDef>(assets).filter(a => a.status === 'temporary').length;
  const photos = new Map<string, ArchivePhoto>();
  [...archivePhotos, reflectorPhoto, lunokhodModelPhoto, lunokhodOrbitPhoto, apolloLrvPhoto,
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
      <h3>ASTER — Abandoned But Not Forgotten</h3>
      <p>An interactive webcomic in three chapters, created for the NASA Space Apps Challenge (“Abandoned but Not
        Forgotten”). Original story, characters, screenplay and illustrations by the ASTER team.</p>
      <p className="credits-note">Work in progress: {temporary} art slots in this build still hold temporary
        placeholders or stand-ins, labelled on screen, which the ASTER art team is replacing with final artwork.</p>
    </section>
    <section>
      <h3>Fact and fiction</h3>
      <p>Apollo 11, Mars Pathfinder, Sojourner, Spirit, Opportunity, Curiosity and Perseverance are real; the
        dates and findings shown in the archive panels are documented history from the NASA sources below.</p>
      <p>Aster, its crew, the lunar refuelling stop, the human Mars expedition, the recovery of Sojourner, the
        “Heritage Recovery” authorization and the Mars Colony Museum are fiction. They are not NASA operations,
        policies or plans, and NASA does not endorse this project. Reconstructions are illustrations, not footage.</p>
      <p className="credits-note">Mission lengths for Mars rovers are counted in sols (Martian days of about
        24 hours 39 minutes). The characters say “days” as people do in conversation; the timelines say “sols”.</p>
    </section>
    <section>
      <h3>Historical sources</h3>
      <ul>
        {Object.values(sources).map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label}</a></li>)}
        <li><a href="https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11.html" target="_blank" rel="noreferrer">NASA NSSDC — Apollo 11 archive</a></li>
        <li>NASA (2011), “Recommendations to Space-Faring Entities: How to Protect and Preserve the Historic and
          Scientific Value of U.S. Government Lunar Artifacts”.</li>
      </ul>
      <h3>NASA photographs</h3>
      <ul>
        {[...photos.values()].map(p => <li key={p.nasaId}>
          {p.nasaId}: {p.credit}{p.available ? '' : ' (image pending)'} — <a href={p.source} target="_blank" rel="noreferrer">catalogue</a>
        </li>)}
      </ul>
    </section>
    <section>
      <h3>Illustrated star field</h3>
      <p>The painted deep-space background used in space scenes and chapter-end cards was generated
        with OpenAI image generation, using the team’s ASTER title-screen painting as a style reference.</p>
    </section>
    <section>
      <h3>Sound</h3>
      <p>Character voice blips, story sound cues and the ambient music are original and synthesized in your browser.
        No third-party recordings are used.</p>
    </section>
    <section>
      <h3>AI disclosure</h3>
      <p>The story, characters, visual direction, the original Mara and Eli character references and the
        mini-game concepts are the team’s own work. Pip and the spacecraft were conceived by the team; their
        illustrations, the backgrounds and the additional character poses were produced with generative image
        tools from the team’s references and direction.</p>
      <p>AI coding tools (OpenAI Codex and Anthropic’s Claude) helped write and refine the website’s code and
        its temporary placeholder graphics. The full statement is under “What’s made with AI?” on the title
        screen and in every chapter, and in docs/AI_DISCLOSURE.md.</p>
    </section>
    <section>
      <h3>Typefaces and data</h3>
      <ul>
        <li>Barlow Condensed — SIL Open Font License 1.1 (<a href={publicUrl('assets/fonts/OFL.txt')} target="_blank" rel="noreferrer">license</a>)</li>
        <li>Earth illustration coastlines — Natural Earth (public domain)</li>
      </ul>
    </section>
    <button type="button" className="close-button" onClick={onClose}>Close</button>
    </div>
    </div>
  </dialog>;
}
