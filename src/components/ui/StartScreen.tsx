import React from 'react';
import './StartScreen.css';
import { useAudio } from '../audio/AudioContext';
import SoundToggle from '../audio/SoundToggle';
import SceneArt from '../visual/SceneArt';
import { AsterMark } from '../visual/ChapterFrame';
import { preloadAssets } from '../../data/assetManifest';
import { chapterList } from '../../chapters';

type Props = {
  /** Start the story at chapter `index` (0-based). */
  onBegin: (index: number) => void;
  onCredits: () => void;
  /** Chapter requested by a ?chapter=N link: offered as the primary action. */
  initial?: number;
};

export default function StartScreen({ onBegin, onCredits, initial }: Props) {
  const { unlock } = useAudio();
  const [chapters, setChapters] = React.useState(false);
  const first = initial ?? 0;

  React.useEffect(() => {
    // Warm the first chapter's code and opening art while the reader is on the title.
    void chapterList[first].load().catch(() => {});
    preloadAssets(chapterList[first].preload);
  }, [first]);

  const begin = (index: number) => {
    unlock(); // Audio may only start from a gesture.
    onBegin(index);
  };

  return <main className="scene start-screen">
    <SceneArt asset="spaceEarthLimb" className="cover-art" label="Earth seen from orbit"/>
    <span className="cover-shade" aria-hidden="true"/>
    <span className="cover-aster-track" aria-hidden="true"><SceneArt asset="aster" className="cover-aster"/></span>
    <div className="cover-copy">
      <AsterMark/>
      <h1 className="title">ASTER</h1>
      <p className="subtitle">Abandoned But Not Forgotten</p>
      <p className="chapter-label"><span>An interactive webcomic</span> Three chapters · about 10 minutes</p>
      <div className="cover-actions">
        <button type="button" className="begin-button" onClick={() => begin(first)}>
          {first === 0 ? 'Begin the Story' : `Begin Chapter ${chapterList[first].number}`}
        </button>
        <button type="button" className="text-button" aria-expanded={chapters} aria-controls="cover-chapters"
          onClick={() => setChapters(open => !open)}>Chapters</button>
      </div>
      {chapters && <ol id="cover-chapters" className="chapter-list cover-chapters">
        {chapterList.map((entry, i) => <li key={entry.id}>
          <button type="button" onClick={() => begin(i)}>
            <span className="chapter-list-number">{entry.number}</span>
            <span className="chapter-list-title">{entry.title}<small>{entry.place}</small></span>
          </button>
        </li>)}
      </ol>}
    </div>
    <div className="cover-tools">
      <button type="button" className="text-button" onClick={onCredits}>Credits &amp; Sources</button>
      <SoundToggle/>
    </div>
  </main>;
}
