import React, { useCallback, useEffect, useState } from 'react';
import StartScreen from '../ui/StartScreen';
import CreditsPanel from '../ui/CreditsPanel';
import StoryboardPlayer from './StoryboardPlayer';
import { AudioProvider } from '../audio/AudioContext';
import { chapterIndexFromQuery, chapterList } from '../../chapters';
import { preloadAssets } from '../../data/assetManifest';
import type { Chapter } from '../../story/types';

// Central controller for story flow: title screen → Chapter 1 → Chapter 2 → Chapter 3 → replay.
// The player owns beat-level progression inside a chapter; this component owns which chapter is on screen,
// loads chapter data on demand and handles replay, restart and chapter selection.
export const StoryController: React.FC = () => {
  /** null = title screen. */
  const [index, setIndex] = useState<number | null>(null);
  const [run, setRun] = useState(0);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [failed, setFailed] = useState(false);
  const [credits, setCredits] = useState(false);

  const openCredits = useCallback(() => setCredits(true), []);
  const start = useCallback((target: number) => {
    setIndex(target);
    setRun(r => r + 1);
  }, []);
  const replay = useCallback(() => setRun(r => r + 1), []);
  const replayStory = useCallback(() => start(0), [start]);
  const toTitle = useCallback(() => setIndex(null), []);

  useEffect(() => {
    if (index === null) {
      setChapter(null);
      return;
    }
    let active = true;
    setFailed(false);
    setChapter(current => (current?.id === chapterList[index].id ? current : null));
    chapterList[index].load().then(loaded => {
      if (active) setChapter(loaded);
    }, () => {
      if (active) setFailed(true);
    });
    // Warm the next chapter's code and opening art while this one plays.
    const following = chapterList[index + 1];
    if (following) {
      void following.load().catch(() => {});
      preloadAssets(following.preload);
    }
    return () => { active = false; };
  }, [index, run]);

  let screen: React.ReactNode;
  if (index === null) {
    screen = <StartScreen onBegin={start} onCredits={openCredits} initial={chapterIndexFromQuery()}/>;
  } else if (chapter && chapter.id === chapterList[index].id) {
    const hasNext = index + 1 < chapterList.length;
    screen = <StoryboardPlayer key={`${chapter.id}:${run}`} chapter={chapter}
      nextNumber={hasNext ? chapterList[index + 1].number : undefined}
      onNext={hasNext ? () => start(index + 1) : undefined}
      onReplay={replay} onReplayStory={replayStory} onSelectChapter={start} onTitle={toTitle} onCredits={openCredits}/>;
  } else {
    screen = <main className="scene chapter-loading" aria-busy={!failed}>
      {failed
        ? <div className="chapter-loading-copy" role="alert">
            <p>This chapter could not be loaded. Check your connection and try again.</p>
            <button type="button" className="begin-button" onClick={replay}>Try again</button>
            <button type="button" className="text-button" onClick={toTitle}>Back to title</button>
          </div>
        : <p className="chapter-loading-copy" role="status">Chapter {chapterList[index].number} · {chapterList[index].title}</p>}
    </main>;
  }

  return (
    <AudioProvider>
      {screen}
      {credits && <CreditsPanel onClose={() => setCredits(false)}/>}
    </AudioProvider>
  );
};
