import React from 'react';
import type { FxKind } from './types';
import { useStoryActions } from './StoryActions';
import InteractiveHotspot from '../components/visual/InteractiveHotspot';
import HistoricalInfoPanel from '../components/ui/HistoricalInfoPanel';
import ChapterEndCard from '../components/ui/ChapterEndScreen';

type Props = { id: string; kind: FxKind; props: Record<string, string | number | boolean> };

// Reusable effect layers. Ambient motion lives in CSS (cheap, and disabled under reduced motion);
// story timing (when an effect appears, how far a gauge fills) is driven by the Director via layer states.
export function Fx({ id, kind, props }: Props) {
  const actions = useStoryActions();
  const text = (key: string) => String(props[key] ?? '');
  switch (kind) {
    case 'glow':
      return <span className={`fx-glow glow-${text('tone') || 'amber'}`}/>;
    case 'thruster':
      return <span className="fx-thruster"><i/><i/></span>;
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
      return actions.ended ? <ChapterEndCard onReplay={actions.replay} onCredits={actions.credits}/> : null;
    default:
      return null;
  }
}
