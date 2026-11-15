import React from 'react';
import SceneArt from './SceneArt';
import PipFace from './PipFace';
import { assets } from '../../data/assetManifest';
import { characters, emoteFor, type CharacterId, type Costume, type EmoteMark, type Expression } from '../../data/characters';

/** Width / height of a character's drawing for a costume (used for layer boxes and portraits). */
export const figureAspect = (id: CharacterId, costume: Costume) => assets[characters[id].looks[costume].base].aspect;

export function Emote({ mark }: { mark: EmoteMark }) {
  const glyph = {
    sparkle: <path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2zM21 1l.9 2.6L24.5 4.5l-2.6.9L21 8l-.9-2.6-2.6-.9 2.6-.9z" fill="#f3d39d"/>,
    sweat: <path d="M12 3c3.5 5 6 8.4 6 11.4A6 6 0 0 1 6 14.4C6 11.4 8.5 8 12 3z" fill="#a9dbe0" stroke="#24414a" strokeWidth="1.4"/>,
    anger: <path d="M5 9q3 0 3-4M19 9q-3 0-3-4M5 15q3 0 3 4M19 15q-3 0-3 4" fill="none" stroke="#e7835f" strokeWidth="2.6" strokeLinecap="round"/>,
    exclaim: <path d="M10 3h4l-1 12h-2zM10.4 18h3.2v3.2h-3.2z" fill="#f4e6c6"/>,
    dots: <g fill="#f4e6c6"><circle cx="5" cy="15" r="2"/><circle cx="12" cy="15" r="2"/><circle cx="19" cy="15" r="2"/></g>,
    question: <path d="M8 8a4 4 0 1 1 6 3.4c-1.4.9-2 1.6-2 3.1M12 18v2.5" fill="none" stroke="#f4e6c6" strokeWidth="2.6" strokeLinecap="round"/>,
    squiggle: <path d="M3 13q2.2-4 4.5 0t4.5 0 4.5 0 4.5 0" fill="none" stroke="#f4e6c6" strokeWidth="2.4" strokeLinecap="round"/>,
  }[mark];
  return <svg className={`emote emote-${mark}`} viewBox="0 0 24 24" aria-hidden="true">{glyph}</svg>;
}

type Props = {
  character: CharacterId;
  costume: Costume;
  expression?: Expression;
  /** Hide the stage emote (the portrait shows its own badge). */
  emote?: boolean;
};

export default function CharacterFigure({ character, costume, expression = 'neutral', emote = true }: Props) {
  const c = characters[character];
  const look = c.looks[costume];
  const art = look.expressions?.[expression] ?? look.base;
  const mark = c.faceScreen ? undefined : emoteFor[expression];
  // The drawing box takes the art's exact proportions (bottom-centred in the layer), so face-screen and
  // emote positions given as fractions of the drawing land on the drawing.
  return <span className="figure" data-character={character} data-expression={expression}
    style={{ '--fa': (assets[art] as { aspect: number }).aspect } as React.CSSProperties}>
    <span className="figure-body">
      <span className="figure-flip">
        <SceneArt asset={art} className="figure-art"/>
        {c.faceScreen && (look.face
          ? <span className="pip-screen" style={{ left: `${look.face.x * 100}%`, top: `${look.face.y * 100}%`,
              width: `${look.face.w * 100}%`, height: `${look.face.h * 100}%` }}><PipFace expression={expression} fit/></span>
          : <PipFace expression={expression}/>)}
        {c.faceScreen && costume === 'flight' && <span className="mag-field" aria-hidden="true"/>}
      </span>
    </span>
    {emote && mark && <span key={`${expression}`} className="figure-emote"
      style={{ '--ex': look.emote[0], '--ey': look.emote[1] } as React.CSSProperties}><Emote mark={mark}/></span>}
  </span>;
}
