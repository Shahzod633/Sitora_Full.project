import React from 'react';
import type { FxKind } from './types';
import { lookupFx } from './fxRegistry';
import { useMouthOpen, useStoryActions } from './StoryActions';
import SceneArt from '../components/visual/SceneArt';
import { assets, type AssetId } from '../data/assetManifest';
import { isCharacterId, type CharacterId } from '../data/characters';
import InteractiveHotspot from '../components/visual/InteractiveHotspot';
import HistoricalInfoPanel from '../components/ui/HistoricalInfoPanel';
import ChapterEndCard from '../components/ui/ChapterEndScreen';

type Props = { id: string; kind: FxKind; props: Record<string, string | number | boolean> };

/** A painted scene with per-character talking frames (identical art except the mouth). The base frame
 * has every mouth closed; while a character's line types out their talking frame flaps on and off. */
function TalkingPainting({ base, frames }: { base: AssetId; frames: Partial<Record<CharacterId, AssetId>> }) {
  const { talking } = useStoryActions();
  const speaker = talking && frames[talking] ? talking : undefined;
  const open = useMouthOpen(speaker);
  return <span className="talking-painting">
    <SceneArt asset={base} className="layer-art"/>
    {(Object.entries(frames) as [CharacterId, AssetId][]).map(([who, asset]) =>
      <SceneArt key={who} asset={asset} className={`layer-art mouth-frame${open && speaker === who ? ' is-open' : ''}`}/>)}
  </span>;
}

// Reusable effect layers. Ambient motion lives in CSS (cheap, and disabled under reduced motion);
// story timing (when an effect appears, how far a gauge fills) is driven by the Director via layer states.
export function Fx({ id, kind, props }: Props) {
  const actions = useStoryActions();
  const text = (key: string) => String(props[key] ?? '');
  switch (kind) {
    case 'talkingPainting': {
      const asset = (key: string) => (Object.hasOwn(assets, text(key)) ? text(key) as AssetId : undefined);
      const frames: Partial<Record<CharacterId, AssetId>> = {};
      for (const key of Object.keys(props)) {
        const frame = asset(key);
        if (isCharacterId(key) && frame) frames[key] = frame;
      }
      return <TalkingPainting base={asset('base') ?? 'cockpit'} frames={frames}/>;
    }
    case 'pipStatus':
      return <span className={`pip-status pip-status-${text('mode') || 'saved'}`}>
        {text('mode') === 'thinking' ? <><i/><i/><i/></> : text('text')}
      </span>;
    case 'glow':
      return <span className={`fx-glow glow-${text('tone') || 'amber'}`}/>;
    case 'thruster':
      return <span className={`fx-thruster${props.single ? ' single' : ''}`}><i/><i/></span>;
    case 'vignette':
      return <span className="fx-vignette"/>;
    case 'marsGlint':
      return <span className="fx-mars"/>;
    case 'nameTag':
      return <span className="name-tag"><strong>{text('name')}</strong><span>{text('role')}</span></span>;
    case 'hud':
      return <span className="hud" role="status">
        <span className="hud-system">{text('system')}</span>
        <strong className="hud-title">{text('title')}</strong>
        <span className="hud-bar"><i/></span>
      </span>;
    case 'pipDiag':
      return <span className="pip-diag"><i/><i/><i/><i/><b/></span>;
    case 'landingPad':
      return <span className="landing-pad"><i/><i/><i/><i/><i/></span>;
    case 'refuelLine':
      return <span className="refuel-coupler"/>;
    case 'statusTag':
      return <span className="status-tag"><span>{text('label')}</span><span className="gauge"><i/></span></span>;
    case 'dust':
      return <span className="fx-dust"><i/><i/><i/><i/><i/><i/></span>;
    case 'landingGlow':
      return <span className="fx-landing-glow"/>;
    case 'shadow':
      return <span className="fx-shadow"/>;
    case 'perimeter':
      return <svg className="perimeter" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx="50" cy="10" rx="47" ry="8"/>
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return <circle key={i} cx={50 + Math.cos(a) * 47} cy={10 + Math.sin(a) * 8} r="1.1" style={{ animationDelay: `${(i % 4) * 0.45}s` }}/>;
        })}
      </svg>;
    case 'reticle':
      return <span className="reticle"><i/><i/><i/><i/><span className="reticle-label">{text('label')}</span></span>;
    case 'scanWave':
      return <span className="scan-wave"><i/><i/><i/></span>;
    case 'hotspot':
      return <InteractiveHotspot label={text('label')} hint={text('hint') || undefined}
        active={actions.interactionTarget === id} onActivate={() => actions.interact(id)}/>;
    case 'dateCard':
      return <span className="date-card">
        <span className="date-kicker">{text('kicker')}</span>
        <strong><span>{text('year')}</span> — {text('title')}</strong>
      </span>;
    case 'archivePanel':
      return <HistoricalInfoPanel/>;
    case 'filmGrain':
      return <span className="film-grain"/>;
    case 'label':
      return <span className="recon-label">{text('text')}</span>;
    case 'archiveBackdrop':
      return <span className="archive-backdrop"/>;
    case 'endCard':
      return actions.ended ? <ChapterEndCard/> : null;
    case 'tint':
      // Flat colour wash driven by layer opacity (dusk light, hologram glow, fade to black inside a stage).
      return <span className={`fx-tint tint-${text('tone') || 'black'}`}/>;
    case 'titleLine':
      return <span className={`title-line title-line-${text('size') || 'md'}`}>{text('text')}</span>;
    default: {
      // Chapter-specific effects and activities (see story/fxRegistry.ts).
      const Custom = lookupFx(kind);
      if (Custom) return <Custom id={id} props={props}/>;
      if (import.meta.env.DEV) console.warn(`[storyboard] unknown fx "${kind}" on layer "${id}"`);
      return null;
    }
  }
}
