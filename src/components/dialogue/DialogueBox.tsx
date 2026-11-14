import React from 'react';
import './DialogueBox.css';
import CharacterPortrait from './CharacterPortrait';
import DialogueText, { type DialogueTextHandle } from './DialogueText';
import { useAudio } from '../audio/AudioContext';
import { characters, type CharacterId, type Costume, type Expression } from '../../data/characters';
import { voiceManifest } from '../../data/voiceManifest';
import type { ScriptLine } from '../../story/types';

export type DialogueBoxHandle = { advance: () => void };

type Props = {
  line?: ScriptLine;
  visible: boolean;
  costume: Costume;
  expression?: Expression;
  /** Called when the reader continues after the line has fully appeared. */
  onAdvance: () => void;
  /** Who is mouthing words right now (while their line types out), or null. Drives lip-sync. */
  onTalkingChange?: (speaker: CharacterId | null) => void;
};

// Undertale-inspired dialogue box: portrait, speaker name, typewriter text with per-character voice blips.
// First click completes the line, the next click advances. Works with click, tap, Space, Enter and →.
const DialogueBox = React.forwardRef<DialogueBoxHandle, Props>(function DialogueBox(
  { line, visible, costume, expression, onAdvance, onTalkingChange }, ref,
) {
  const textRef = React.useRef<DialogueTextHandle>(null);
  const eligible = React.useRef(0);
  const { playVoice, stopVoice } = useAudio();
  const character = line ? characters[line.speaker] : undefined;
  const profile = character ? voiceManifest.profiles[character.voiceProfile] : undefined;

  React.useLayoutEffect(() => {
    eligible.current = 0;
    return stopVoice;
  }, [line, stopVoice]);

  React.useEffect(() => {
    if (!visible) stopVoice();
  }, [visible, stopVoice]);

  // Mouths open while a line is typing out and close as soon as it is complete or hidden.
  const doneLine = React.useRef<string>();
  React.useEffect(() => {
    onTalkingChange?.(visible && line && doneLine.current !== line.id ? line.speaker : null);
  }, [line, visible, onTalkingChange]);
  const onComplete = React.useCallback(() => {
    doneLine.current = line?.id;
    onTalkingChange?.(null);
  }, [line, onTalkingChange]);

  const onReveal = (char: string) => {
    if (!profile || !visible || !/[\p{L}\p{N}]/u.test(char)) return;
    const count = eligible.current++;
    if (count % profile.everyLetters === 0) playVoice(profile, count / profile.everyLetters);
  };

  const advance = () => {
    if (!line || !visible) return;
    stopVoice();
    if (textRef.current?.finishTyping()) return;
    onAdvance();
  };
  React.useImperativeHandle(ref, () => ({ advance }));

  return <div className="dialogue-layer" data-visible={visible} aria-hidden={!visible}>
    {line && character && <button
      type="button"
      className="dialogue-box"
      data-speaker={line.speaker}
      tabIndex={visible ? 0 : -1}
      onClick={event => { event.stopPropagation(); advance(); }}
      aria-label={`${character.name}: ${line.text} — continue`}
    >
      <CharacterPortrait speaker={line.speaker} costume={costume} expression={expression ?? line.expression}/>
      <span className="dialogue-content">
        <span className="speaker-name">{character.name}</span>
        <DialogueText key={line.id} ref={textRef} text={line.text} onReveal={onReveal} onComplete={onComplete}/>
      </span>
      <span className="next-indicator" aria-hidden="true"/>
    </button>}
    <p className="sr-only" aria-live="polite">{visible && line && character ? `${character.name}: ${line.text}` : ''}</p>
  </div>;
});

export default DialogueBox;
