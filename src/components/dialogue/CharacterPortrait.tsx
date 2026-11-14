import React from 'react';
import './CharacterPortrait.css';
import CharacterFigure, { Emote, figureAspect } from '../visual/CharacterFigure';
import SceneArt from '../visual/SceneArt';
import { assets } from '../../data/assetManifest';
import { characters, emoteFor, type CharacterId, type Costume, type Expression } from '../../data/characters';
import { useMouthOpen } from '../../story/StoryActions';

type Props = { speaker: CharacterId; costume: Costume; expression?: Expression };

/** Square frame: place point (fx, fy) of an image with `aspect` at the centre, `zoom` × frame width wide. */
const cropStyle = (fx: number, fy: number, zoom: number, aspect: number): React.CSSProperties => ({
  width: `${zoom * 100}%`,
  height: `${(zoom / aspect) * 100}%`,
  left: `${50 - fx * zoom * 100}%`,
  top: `${50 - (fy * zoom * 100) / aspect}%`,
});

// Portraits crop the same artwork used on stage: the artists' paintings for Mara and Eli (with the
// open-mouth frame while their line types out), Pip's figure with his live face screen.
export default function CharacterPortrait({ speaker, costume, expression = 'neutral' }: Props) {
  const character = characters[speaker];
  const look = character.looks[costume];
  const painted = look.painted;
  const open = useMouthOpen(painted?.talking ? speaker : undefined);
  const mark = character.faceScreen ? undefined : emoteFor[expression];

  let content: React.ReactNode;
  if (painted) {
    const { focus: [fx, fy], zoom } = painted;
    content = <span key={`${speaker}-${costume}`} className="portrait-figure"
      style={cropStyle(fx, fy, zoom, assets[painted.closed].aspect)}>
      <SceneArt asset={painted.closed} className="portrait-paint"/>
      {painted.talking && <SceneArt asset={painted.talking} className={`portrait-paint mouth-frame${open ? ' is-open' : ''}`}/>}
    </span>;
  } else {
    const { focus: [fx, fy], zoom } = look.portrait;
    content = <span key={`${speaker}-${costume}`} className="portrait-figure"
      style={cropStyle(fx, fy, zoom, figureAspect(speaker, costume))}>
      <CharacterFigure character={speaker} costume={costume} expression={expression} emote={false}/>
    </span>;
  }

  return <span className="character-portrait" data-speaker={speaker} role="img" aria-label={`${character.name}, ${expression}`}>
    {content}
    {mark && <span key={expression} className="portrait-emote"><Emote mark={mark}/></span>}
  </span>;
}
