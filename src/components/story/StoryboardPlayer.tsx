import React from 'react';
import '../../story/storyboard.css';
import { Director, type Snapshot } from '../../story/Director';
import { StageView } from '../../story/StageView';
import { StoryActionsContext, type StoryActions } from '../../story/StoryActions';
import type { Chapter } from '../../story/types';
import type { CharacterId } from '../../data/characters';
import DialogueBox, { type DialogueBoxHandle } from '../dialogue/DialogueBox';
import SoundToggle from '../audio/SoundToggle';
import ChapterFrame, { Captions } from '../visual/ChapterFrame';
import { useAudio } from '../audio/AudioContext';

const DevOverlay = import.meta.env.DEV ? React.lazy(() => import('./DevOverlay')) : null;

type Props = {
  chapter: Chapter;
  onReplay: () => void;
  onCredits: () => void;
};

/** Development only: ?beat=B17 starts the chapter at a given beat. */
function devStartIndex(chapter: Chapter) {
  if (!import.meta.env.DEV) return 0;
  const id = new URLSearchParams(window.location.search).get('beat');
  const index = id ? chapter.beats.findIndex(b => b.id.toLowerCase() === id.toLowerCase()) : -1;
  return Math.max(0, index);
}

export default function StoryboardPlayer({ chapter, onReplay, onCredits }: Props) {
  const { playCue } = useAudio();
  const [director, setDirector] = React.useState<Director | null>(null);
  React.useLayoutEffect(() => {
    const instance = new Director(chapter, { cue: playCue, startAt: devStartIndex(chapter) });
    setDirector(instance);
    return () => instance.destroy();
  }, [chapter, playCue]);
  if (!director) return <main className="scene storyboard"/>;
  return <PlayerView director={director} onReplay={onReplay} onCredits={onCredits}/>;
}

function PlayerView({ director, onReplay, onCredits }: { director: Director } & Omit<Props, 'chapter'>) {
  const snap: Snapshot = React.useSyncExternalStore(director.subscribe, director.getSnapshot);
  const chapter = director.chapter;
  const root = React.useRef<HTMLElement>(null);
  const dialogue = React.useRef<DialogueBoxHandle>(null);

  React.useLayoutEffect(() => {
    director.setDialogue({ advance: () => dialogue.current?.advance() });
    const el = root.current!;
    let frame = 0;
    const measure = () => director.resize(el.clientWidth, el.clientHeight);
    measure();
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      director.setDialogue(null);
    };
  }, [director]);

  // After a portrait/landscape recomposition React has re-laid out the boxes; re-frame the camera.
  React.useLayoutEffect(() => { director.reflow(); }, [director, snap.portrait]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('dialog, select, input, textarea')) return;
      const onControl = !!target?.closest?.('button, a');
      if (e.key === 'ArrowRight' || ((e.key === ' ' || e.key === 'Enter') && !onControl)) {
        e.preventDefault();
        director.primary();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [director]);

  const onClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a, [data-no-advance]')) return;
    director.primary();
  };

  const [talking, setTalking] = React.useState<CharacterId | null>(null);
  const actions = React.useMemo<StoryActions>(() => ({
    interact: target => director.interact(target),
    replay: onReplay,
    credits: onCredits,
    interactionTarget: snap.interaction?.target,
    ended: snap.phase === 'end',
    talking,
  }), [director, onReplay, onCredits, snap.interaction?.target, snap.phase, talking]);

  const speakerExpression = snap.line ? snap.expressions[snap.line.speaker] : undefined;

  return <StoryActionsContext.Provider value={actions}>
    <main ref={root} className="scene storyboard" data-phase={snap.phase} data-stage={snap.beat.stage}
      data-portrait={snap.portrait} onClick={onClick} aria-roledescription="interactive comic">
      <h1 className="sr-only">ASTER — Chapter {chapter.number}: {chapter.title}</h1>
      {snap.stages.map(stage =>
        <StageView key={stage.key} stageKey={stage.key} director={director} def={chapter.stages[stage.id]}
          portrait={snap.portrait} expressions={snap.expressions}/>)}
      <div className="film-grain overlay-grain" ref={director.grainRef} aria-hidden="true"/>
      <div className="veil" ref={director.veilRef} aria-hidden="true"/>
      <ChapterFrame number={chapter.number} title={chapter.title} sequences={chapter.sequences}
        current={snap.beat.sequence} hidden={snap.beat.stage === 'ending'}/>
      <Captions captions={snap.captions} beatId={snap.beat.id}/>
      {snap.interaction && <p className="story-hint" role="status">{snap.interaction.hint}</p>}
      {snap.confirm && <button type="button" className="next-button story-confirm"
        onClick={e => { e.stopPropagation(); director.confirm(); }}>{snap.confirm.label}</button>}
      {snap.phase === 'cinematic' && snap.beat.advance.mode === 'auto' &&
        <p className="skip-hint" aria-hidden="true">Click or press Space to continue</p>}
      <DialogueBox ref={dialogue} line={snap.line} visible={snap.dialogueVisible} costume={snap.costume}
        expression={speakerExpression} onAdvance={director.advanceLine} onTalkingChange={setTalking}/>
      <SoundToggle/>
      {DevOverlay && <React.Suspense fallback={null}><DevOverlay director={director} snap={snap}/></React.Suspense>}
    </main>
  </StoryActionsContext.Provider>;
}
