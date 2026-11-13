import React from 'react';
import './CharacterPortrait.css';
import CharacterFigure, { Emote, figureAspect } from '../visual/CharacterFigure';
import { characters, emoteFor, type CharacterId, type Costume, type Expression } from '../../data/characters';

type Props = { speaker: CharacterId; costume: Costume; expression?: Expression };

// Crops the same character drawing used on stage (so the portrait always matches the scene,
// including EVA helmets on the Moon and Pip's live face screen).
export default function CharacterPortrait({ speaker, costume, expression = 'neutral' }: Props) {
  const character = characters[speaker];
  const look = character.looks[costume];
  const { focus: [fx, fy], zoom } = look.portrait;
  const aspect = figureAspect(speaker, costume);
  // Square frame: width 100% = height. Place the focus point at the centre at `zoom` × frame width.
  const style: React.CSSProperties = {
    width: `${zoom * 100}%`,
    height: `${(zoom / aspect) * 100}%`,
    left: `${50 - fx * zoom * 100}%`,
    top: `${50 - (fy * zoom * 100) / aspect}%`,
  };
  const mark = character.faceScreen ? undefined : emoteFor[expression];
  return <span className="character-portrait" data-speaker={speaker} role="img" aria-label={`${character.name}, ${expression}`}>
    <span key={`${speaker}-${costume}`} className="portrait-figure" style={style}>
      <CharacterFigure character={speaker} costume={costume} expression={expression} emote={false}/>
    </span>
    {mark && <span key={expression} className="portrait-emote"><Emote mark={mark}/></span>}
  </span>;
}
