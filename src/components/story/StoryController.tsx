import React, { useState } from 'react';
import StartScreen from '../ui/StartScreen';
import ChapterEndScreen from '../ui/ChapterEndScreen';
import EarthDeparture from '../../chapters/chapter01/scenes/EarthDeparture';
import AsterBridge from '../../chapters/chapter01/scenes/AsterBridge';
import ApolloLegacy from '../../chapters/chapter01/scenes/ApolloLegacy';
import { SceneKey } from '../../types/scene';
import { AudioProvider } from '../audio/AudioContext';

// Centralized controller for chapter flow
export const StoryController: React.FC = () => {
  const scenes: SceneKey[] = ['earthDeparture', 'asterBridge', 'apolloLegacy'];
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState(false);

  const startStory = () => setStarted(true);
  const advanceScene = () => {
    if (currentIdx + 1 < scenes.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCompleted(true);
    }
  };
  const replay = () => {
    setCurrentIdx(0);
    setCompleted(false);
  };

  if (!started) {
    return (
      <AudioProvider>
        <StartScreen onBegin={startStory} />
      </AudioProvider>
    );
  }

  if (completed) {
    return (
      <AudioProvider>
        <ChapterEndScreen onReplay={replay} />
      </AudioProvider>
    );
  }

  const currentScene = scenes[currentIdx];
  const SceneComponent = {
    earthDeparture: EarthDeparture,
    asterBridge: AsterBridge,
    apolloLegacy: ApolloLegacy,
  }[currentScene];

  return (
    <AudioProvider>
      <SceneComponent onNext={advanceScene} />
    </AudioProvider>
  );
};

