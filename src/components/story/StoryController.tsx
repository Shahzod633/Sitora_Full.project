import React, { useCallback, useState } from 'react';
import StartScreen from '../ui/StartScreen';
import CreditsPanel from '../ui/CreditsPanel';
import StoryboardPlayer from './StoryboardPlayer';
import { AudioProvider } from '../audio/AudioContext';
import { chapter01 } from '../../chapters/chapter01';

// Centralized controller for chapter flow: start screen → storyboard player (33 beats, including the
// ending card) → replay. The player owns beat-level progression; this component owns screen-level flow.
export const StoryController: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [run, setRun] = useState(0);
  const [credits, setCredits] = useState(false);

  const openCredits = useCallback(() => setCredits(true), []);
  const replay = useCallback(() => setRun(r => r + 1), []);

  return (
    <AudioProvider>
      {started
        ? <StoryboardPlayer key={run} chapter={chapter01} onReplay={replay} onCredits={openCredits}/>
        : <StartScreen onBegin={() => setStarted(true)} onCredits={openCredits}/>}
      {credits && <CreditsPanel onClose={() => setCredits(false)}/>}
    </AudioProvider>
  );
};
