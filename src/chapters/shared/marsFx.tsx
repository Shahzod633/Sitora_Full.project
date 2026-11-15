import React from 'react';
import './mars.css';
import SceneArt from '../../components/visual/SceneArt';
import { registerFx, type FxProps } from '../../story/fxRegistry';
import type { AssetId } from '../../data/assetManifest';

// Effect layers shared by the two Mars chapters. Story timing comes from the Director (layer opacity and
// CSS variables such as --n or --wipe); these components only draw.

/** The object Pip detects: a drift of dust with a corner of metal and one wheel showing. */
function Mound() {
  return <span className="mound"><i/><b/></span>;
}

/** Heating around Aster during atmospheric entry (Mars has an atmosphere; the Moon does not). */
function EntryGlow() {
  return <span className="entry-glow"><i/><i/><i/></span>;
}

const HOLOGRAMS: { asset: AssetId; name: string; year: string }[] = [
  { asset: 'holoSojourner', name: 'Sojourner', year: '1997' },
  { asset: 'holoSpirit', name: 'Spirit', year: '2004' },
  { asset: 'holoOpportunity', name: 'Opportunity', year: '2004' },
  { asset: 'holoCuriosity', name: 'Curiosity', year: '2012' },
  { asset: 'holoPerseverance', name: 'Perseverance', year: '2021' },
];

/** Holographic models of the five rovers. `--n` (0–5) on the layer is how many have materialised. */
function HoloRow() {
  return <span className="holo-row" role="img" aria-label="Holographic models of five Mars rovers: Sojourner, Spirit, Opportunity, Curiosity and Perseverance">
    {HOLOGRAMS.map((holo, i) => <span key={holo.name} className="holo" style={{ '--i': i } as React.CSSProperties}>
      <span className="holo-model"><SceneArt asset={holo.asset} className="holo-art"/></span>
      <span className="holo-beam" aria-hidden="true"/>
      <span className="holo-name" aria-hidden="true"><strong>{holo.name}</strong>{holo.year}</span>
    </span>)}
  </span>;
}

/** MARS PATHFINDER / 1997 / SOJOURNER ROVER. */
function MissionCard({ props }: FxProps) {
  return <span className="mission-card">
    <span className="date-kicker">{String(props.kicker ?? 'Reconstruction from the mission archive')}</span>
    <strong>{String(props.title ?? '')}</strong>
    <span className="mission-year">{String(props.year ?? '')}</span>
    <span className="mission-sub">{String(props.sub ?? '')}</span>
  </span>;
}

/** Sojourner's nameplate. `--wipe` (0–1) on the layer clears the dust and brings the name up. */
function Nameplate() {
  return <span className="nameplate" role="img" aria-label="The rover's nameplate: SOJOURNER">
    <b>SOJOURNER</b><i/>
  </span>;
}

registerFx('mound', Mound);
registerFx('entryGlow', EntryGlow);
registerFx('holoRow', HoloRow);
registerFx('missionCard', MissionCard);
registerFx('nameplate', Nameplate);
