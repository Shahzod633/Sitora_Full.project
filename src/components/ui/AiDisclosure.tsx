import React from 'react';
import './AiDisclosure.css';
import { publicUrl } from '../../data/assetManifest';

// "What's made with AI?" — a plain statement of who made what: the team's own story, characters and direction
// on one side, and the production help from AI tools on the other. It complements Credits & Sources (which
// keeps the historical sources and third-party licences) and never opens by itself.
//
// Keep this text in step with the site: when AI-assisted artwork or code is added, say so here and in
// docs/AI_DISCLOSURE.md.

/** The clickable mark. Icon and label share one hit area; phones use the short label. */
export function AiButton({ onOpen, className = '' }: { onOpen: () => void; className?: string }) {
  return <button type="button" className={`ai-chip ${className}`} aria-haspopup="dialog"
    aria-label="What’s made with AI? Open Project Details"
    onClick={event => { event.stopPropagation(); onOpen(); }}>
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2"/><path d="M12 11v6" strokeLinecap="round"/><circle cx="12" cy="7.6" r="0.6" fill="currentColor"/>
    </svg>
    <span className="ai-chip-full" aria-hidden="true">What’s made with AI?</span>
    <span className="ai-chip-short" aria-hidden="true">AI / SI credits</span>
  </button>;
}

type PanelProps = {
  onClose: () => void;
  /** Leave this panel and open the real Credits & Sources panel (one modal at a time). */
  onCredits: () => void;
};

export default function AiPanel({ onClose, onCredits }: PanelProps) {
  const ref = React.useRef<HTMLDialogElement>(null);
  React.useLayoutEffect(() => {
    const dialog = ref.current!;
    // Focus returns to whatever opened the panel (the mark) once it closes.
    const opener = document.activeElement as HTMLElement | null;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    return () => {
      if (typeof dialog.close === 'function' && dialog.open) dialog.close();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  return <dialog className="ai-panel" ref={ref} aria-labelledby="ai-title" aria-describedby="ai-intro" data-no-advance
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { event.stopPropagation(); if (event.target === ref.current) onClose(); }}>
    <div className="ai-body">
      <header className="ai-head">
        <div>
          <p className="ai-kicker">ASTER · Authorship &amp; AI / SI credits</p>
          <h2 id="ai-title">Project Details</h2>
        </div>
        <button type="button" className="ai-close" aria-label="Close" onClick={onClose} autoFocus>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </header>
      <div className="ai-scroll">
        <p id="ai-intro" className="ai-intro">ASTER began with our team’s original story, characters, and artistic direction. We used AI
          tools to help bring parts of that vision to the screen. Here is how the work was shared.</p>

        <section className="ai-block" data-kind="team">
          <h3>About ASTER</h3>
          <p>Abandoned But Not Forgotten is an interactive webcomic in three chapters, created for the NASA
            Space Apps Challenge. Illustrated scenes, dialogue, sound and mini-games connect a fictional
            future expedition with the legacy of real space missions.</p>
        </section>

        <section className="ai-block" data-kind="team">
          <h3>Created by our team</h3>
          <p>We created ASTER’s story from scratch, including its characters, personalities, relationships, and
            narrative. Our team established the visual direction, drew the original Mara and Eli character
            references, and designed the mini-game concepts.</p>
        </section>

        <section className="ai-block" data-kind="shared">
          <h3>Original concepts, assisted illustrations</h3>
          <p>Pip and the spacecraft were conceived by our team. Their illustrations were produced with AI
            assistance rather than drawn entirely by hand by our team.</p>
        </section>

        <section className="ai-block" data-kind="ai">
          <h3>AI-assisted artwork</h3>
          <p>We used generative image tools to create backgrounds and additional character poses, guided by our
            references and visual direction. This includes the painted star field and Pip’s pose carrying
            Sojourner. AI tools also helped prepare selected visual assets, such as our logo, for use on the
            website.</p>
        </section>

        <section className="ai-block" data-kind="ai">
          <h3>AI-assisted development</h3>
          <p>AI coding tools, including OpenAI Codex and Anthropic’s Claude (through Claude Code), helped write
            and refine the website’s code under the team’s direction: the story player, the interactive
            activities, scene transitions, responsive layouts, animations, and bug fixes, as well as the
            temporary placeholder graphics that are labelled on screen.</p>
          <p>The team’s creative authorship and the tools’ production assistance are described separately here.</p>
          <p>ChatGPT also helped structure development requests and draft explanatory project text. These
            tools are production assistants, not sources of historical mission data.</p>
        </section>

        <section className="ai-block" data-kind="sources">
          <h3>Fact and fiction</h3>
          <p>Apollo 11, Lunokhod 1, Mars Pathfinder and the Mars rovers are real missions. Their historical
            information and archive images are credited in the source sections. Aster, its crew, the lunar
            refuelling stop, the human Mars expedition and the recovery of Sojourner are fiction, not NASA
            operations or plans. NASA does not endorse this project.</p>
          <p>The APXS spectrum in the rover activity is an illustrative animation, not measured mission data.</p>
        </section>

        <section className="ai-block" data-kind="sources">
          <h3>Sound and typography</h3>
          <p>Character voice blips, story cues and ambient music are synthesized in the browser by the
            website’s code. A legacy click sample remains in the project; its origin is not documented.</p>
          <p>Barlow Condensed is used under the SIL Open Font License 1.1. <a href={publicUrl('assets/fonts/OFL.txt')}
            target="_blank" rel="noreferrer">Read the font license</a>.</p>
        </section>

        <section className="ai-block" data-kind="sources">
          <h3>Sources and historical material</h3>
          <p>NASA Data lists the NASA mission information and imagery used in the story. Space Agency &amp;
            Other lists used materials from other providers. Development tools are described here, not
            listed as data sources.
            Generated illustrations are artistic interpretations, not NASA photographs or mission records.</p>
          <button type="button" className="ai-link" onClick={onCredits}>View Credits &amp; Sources</button>
        </section>

        <p className="ai-terms"><strong>Terminology:</strong> We use AI here for clarity. NASA’s current communications also
          use the term Super Intelligence (SI). <a href="https://www.nasa.gov/what-is-super-intelligence/" target="_blank"
          rel="noreferrer">What is Super Intelligence? (nasa.gov)</a></p>
      </div>
    </div>
  </dialog>;
}
