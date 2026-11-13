import React from 'react';
import './CharacterPortrait.css';
import SceneArt from '../visual/SceneArt';
import { assetManifest } from '../../data/assetManifest';

export default function CharacterPortrait({ speaker, expression }: { speaker: string; expression?: string }) {
  const crew = assetManifest.characters;
  const key = speaker.toLowerCase();
  const art = Object.hasOwn(crew, key) ? crew[key as keyof typeof crew] : undefined;
  return <span className="character-portrait" role="img" aria-label={`${speaker}, ${expression || 'neutral'}`}>
    {art ? <SceneArt asset={art} className="portrait-art"/> : speaker.charAt(0)}
  </span>;
}
