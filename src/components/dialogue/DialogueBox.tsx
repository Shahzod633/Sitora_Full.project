import React from 'react';
import './DialogueBox.css';
import CharacterPortrait from './CharacterPortrait';
import DialogueText, { type DialogueTextHandle } from './DialogueText';
import { useAudio } from '../audio/AudioContext';
import SoundToggle from '../audio/SoundToggle';
import { characters } from '../../data/characters';
import { voiceManifest } from '../../data/voiceManifest';

export type DialogueLine = {
  id: string;
  speaker: string;
  text: string;
  expression?: string;
  voiceProfile?: string;
  onComplete?: () => void;
};

type Props = { lines: DialogueLine[]; onSequenceEnd: () => void };

export default function DialogueBox({ lines, onSequenceEnd }: Props) {
  const [index, setIndex] = React.useState(0);
  const line = lines[index];
  const textRef = React.useRef<DialogueTextHandle>(null);
  const eligible = React.useRef(0);
  const { playVoice, stopVoice } = useAudio();
  const id = line.voiceProfile ?? characters[line.speaker?.toLowerCase()]?.voiceProfile;
  const profile = id && Object.hasOwn(voiceManifest.profiles, id)
    ? voiceManifest.profiles[id as keyof typeof voiceManifest.profiles] : undefined;
  React.useLayoutEffect(() => {
    eligible.current = 0;
    return stopVoice;
  }, [line, stopVoice]);
  const onReveal = (character: string) => {
    if (!profile || !/[\p{L}\p{N}]/u.test(character)) return;
    const count = eligible.current++;
    if (count % profile.everyLetters === 0) playVoice(profile, count / profile.everyLetters);
  };
  const advance = () => {
    stopVoice();
    if (textRef.current?.finishTyping()) return;
    if (index + 1 < lines.length) setIndex(index + 1);
    else onSequenceEnd();
  };

  return <><SoundToggle/><button className="dialogue-box" onClick={advance} aria-label={`${line.speaker}: ${line.text} Reveal or advance dialogue`}>
    <CharacterPortrait speaker={line.speaker} expression={line.expression}/>
    <span className="dialogue-content">
      <span className="speaker-name">{line.speaker}</span>
      <DialogueText key={line.id} ref={textRef} text={line.text} onReveal={onReveal}/>
    </span>
    <span className="next-indicator" aria-hidden="true"/>
  </button></>;
}
