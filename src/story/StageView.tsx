import React from 'react';
import { assets } from '../data/assetManifest';
import type { CharacterId, Costume, Expression } from '../data/characters';
import SceneArt from '../components/visual/SceneArt';
import CharacterFigure, { figureAspect } from '../components/visual/CharacterFigure';
import { boxStyle } from './camera';
import { Fx } from './fx';
import type { Director, StageHandle } from './Director';
import type { LayerDef, StageDef } from './types';

type LayerProps = {
  def: LayerDef;
  portrait: boolean;
  costume: Costume;
  expressions: Partial<Record<CharacterId, Expression>>;
};

function LayerView({ def, portrait, costume, expressions }: LayerProps) {
  const aspect = def.asset ? assets[def.asset].aspect : def.character ? figureAspect(def.character, costume) : undefined;
  const style = boxStyle(def, portrait, aspect);
  const point = style.width === 0;
  let content: React.ReactNode = null;
  if (def.asset) {
    content = <SceneArt asset={def.asset} label={def.label} portrait={portrait} className="layer-art"/>;
  } else if (def.character) {
    content = <span className="layer-figure" role="img" aria-label={def.label}>
      <CharacterFigure character={def.character} costume={costume} expression={expressions[def.character]}/>
    </span>;
  } else if (def.fx) {
    content = <Fx id={def.id} kind={def.fx} props={def.props ?? {}}/>;
  }
  const classes = ['layer', def.fx && `fx fx-${def.fx}`, def.character && 'is-character', point && 'is-point'];
  return <div className={classes.filter(Boolean).join(' ')} data-layer={def.id} style={style}>
    {point ? <span className="point-content">{content}</span> : content}
    {def.children?.map(child =>
      <LayerView key={child.id} def={child} portrait={portrait} costume={costume} expressions={expressions}/>)}
  </div>;
}

type Props = {
  director: Director;
  stageKey: number;
  def: StageDef;
  portrait: boolean;
  expressions: Partial<Record<CharacterId, Expression>>;
};

/** Renders one illustrated stage from data. Each top-level layer sits in a camera plane with its own depth. */
function StageViewImpl({ director, stageKey, def, portrait, expressions }: Props) {
  const root = React.useRef<HTMLDivElement>(null);
  const world = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const el = root.current!;
    const layers = new Map<string, HTMLElement>();
    el.querySelectorAll<HTMLElement>('[data-layer]').forEach(node => layers.set(node.dataset.layer!, node));
    const cams = Array.from(el.querySelectorAll<HTMLElement>('[data-cam]'))
      .map(node => ({ el: node, depth: Number(node.dataset.cam) }));
    const handle: StageHandle = { root: el, world: world.current!, layer: id => layers.get(id), cams: () => cams };
    director.registerStage(stageKey, handle);
    return () => director.unregisterStage(stageKey, handle);
  }, [director, stageKey]);

  return <div ref={root} className={`stage tone-${def.tone}`} data-stage={def.id} role="group" aria-label={def.label}>
    <div ref={world} className="stage-world">
      {def.layers.map(layer =>
        <div key={layer.id} className="cam" data-cam={layer.depth ?? 1}>
          <LayerView def={layer} portrait={portrait} costume={def.costume} expressions={expressions}/>
        </div>)}
    </div>
  </div>;
}

export const StageView = React.memo(StageViewImpl);
