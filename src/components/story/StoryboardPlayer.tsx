import React from 'react';
import '../../story/storyboard.css';
import { Director, type Snapshot } from '../../story/Director';
import { StageView } from '../../story/StageView';
import { StoryActionsContext, type StoryActions } from '../../story/StoryActions';
import type { Chapter, LayerDef, StageDef } from '../../story/types';
import { characters, type CharacterId } from '../../data/characters';
import { SHOW_PLACEHOLDER_LABEL, assets, isTemporary, type AssetId } from '../../data/assetManifest';
import DialogueBox, { type DialogueBoxHandle } from '../dialogue/DialogueBox';
import PauseMenu from '../ui/PauseMenu';
import SoundToggle from '../audio/SoundToggle';
import { HUD_SLOT_ID } from '../interactions/ActivityHud';
import ChapterFrame, { Captions } from '../visual/ChapterFrame';
import { useAudio } from '../audio/AudioContext';

const DevOverlay = import.meta.env.DEV ? React.lazy(() => import('./DevOverlay')) : null;

type Props = {
  chapter: Chapter;
  /** Number of the following chapter ("02"), when there is one. */
  nextNumber?: string;
  onNext?: () => void;
  onReplay: () => void;
  onReplayStory: () => void;
  onSelectChapter: (index: number) => void;
  onTitle: () => void;
  onCredits: () => void;
};

/** Development only: ?beat=B17 starts the chapter at a given beat. */
function devStartIndex(chapter: Chapter) {
  if (!import.meta.env.DEV) return 0;
  const id = new URLSearchParams(window.location.search).get('beat');
  const index = id ? chapter.beats.findIndex(b => b.id.toLowerCase() === id.toLowerCase()) : -1;
  return Math.max(0, index);
}

/** True when a stage still shows placeholder art (bundled stand-ins rather than the artists' work). */
function usesPlaceholderArt(stage: StageDef) {
  const visit = (layers: LayerDef[]): boolean => layers.some(layer => {
    if (layer.asset && isTemporary(layer.asset)) return true;
    if (layer.character && isTemporary(characters[layer.character].looks[stage.costume].base)) return true;
    for (const value of Object.values(layer.props ?? {})) {
      if (typeof value === 'string' && Object.hasOwn(assets, value) && isTemporary(value as AssetId)) return true;
    }
    return layer.children ? visit(layer.children) : false;
  });
  return visit(stage.layers);
}

export default function StoryboardPlayer({ chapter, ...rest }: Props) {
  const { playCue, setMusic, stopAll, resume } = useAudio();
  const [director, setDirector] = React.useState<Director | null>(null);
  React.useLayoutEffect(() => {
    const instance = new Director(chapter, { cue: playCue, music: setMusic, startAt: devStartIndex(chapter) });
    setDirector(instance);
    return () => {
      instance.destroy();
      // Nothing from this chapter may keep sounding after it unmounts.
      resume();
      stopAll();
    };
  }, [chapter, playCue, setMusic, stopAll, resume]);
  if (!director) return <main className="scene storyboard"/>;
  return <PlayerView director={director} {...rest}/>;
}

function PlayerView({ director, nextNumber, onNext, onReplay, onReplayStory, onSelectChapter, onTitle, onCredits }:
  { director: Director } & Omit<Props, 'chapter'>) {
  const snap: Snapshot = React.useSyncExternalStore(director.subscribe, director.getSnapshot);
  const chapter = director.chapter;
  const audio = useAudio();
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

  const pause = React.useCallback(() => director.pause(), [director]);
  const resume = React.useCallback(() => director.resume(), [director]);

  // Audio freezes and thaws with the story.
  const { suspend: suspendAudio, resume: resumeAudio } = audio;
  React.useEffect(() => {
    if (snap.paused) suspendAudio();
    else resumeAudio();
  }, [snap.paused, suspendAudio, resumeAudio]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (e.key === 'Escape' || ((e.key === 'p' || e.key === 'P') && !target?.closest?.('input, textarea, select'))) {
        // A <dialog> (credits, pause menu) handles its own Escape.
        if (target?.closest?.('dialog')) return;
        e.preventDefault();
        if (director.getSnapshot().paused) director.resume(); else director.pause();
        return;
      }
      if (target?.closest?.('dialog, select, input, textarea, [data-keys]')) return;
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
    if ((e.target as HTMLElement).closest('button, a, input, [data-no-advance]')) return;
    director.primary();
  };

  const [talking, setTalking] = React.useState<CharacterId | null>(null);
  const actions = React.useMemo<StoryActions>(() => ({
    interact: target => director.interact(target),
    replay: onReplay,
    replayStory: onReplayStory,
    next: onNext,
    credits: onCredits,
    interactionTarget: snap.interaction?.target,
    ended: snap.phase === 'end',
    paused: snap.paused,
    portrait: snap.portrait,
    talking,
    chapter: { number: chapter.number, title: chapter.title, ending: chapter.ending, nextNumber },
  }), [director, chapter, nextNumber, onReplay, onReplayStory, onNext, onCredits, snap.interaction?.target, snap.phase,
    snap.paused, snap.portrait, talking]);

  const speakerExpression = snap.line ? snap.expressions[snap.line.speaker] : undefined;
  const stage = chapter.stages[snap.beat.stage];
  const placeholder = React.useMemo(() => SHOW_PLACEHOLDER_LABEL && usesPlaceholderArt(stage), [stage]);
  const quiet = stage.tone === 'black';

  return <StoryActionsContext.Provider value={actions}>
    <main ref={root} className="scene storyboard" data-phase={snap.phase} data-stage={snap.beat.stage}
      data-tone={stage.tone} data-chapter={chapter.number} data-portrait={snap.portrait} data-paused={snap.paused}
      onClick={onClick} aria-roledescription="interactive comic">
      <h1 className="sr-only">ASTER — Chapter {chapter.number}: {chapter.title}</h1>
      {snap.stages.map(s =>
        <StageView key={s.key} stageKey={s.key} director={director} def={chapter.stages[s.id]}
          portrait={snap.portrait} expressions={snap.expressions}/>)}
      <div className="film-grain overlay-grain" ref={director.grainRef} aria-hidden="true"/>
      <div className="veil" ref={director.veilRef} aria-hidden="true"/>
      <ChapterFrame number={chapter.number} title={chapter.title} sequences={chapter.sequences}
        current={snap.beat.sequence} hidden={quiet}/>
      <Captions captions={snap.captions} beatId={snap.beat.id}/>
      {placeholder && !quiet && <p className="placeholder-chip">Placeholder art · final illustrations in progress</p>}
      {snap.interaction?.hint && <p className="story-hint" role="status">{snap.interaction.hint}</p>}
      {snap.confirm && <button type="button" className="next-button story-confirm"
        onClick={e => { e.stopPropagation(); director.confirm(); }}>{snap.confirm.label}</button>}
      {snap.phase === 'cinematic' && snap.beat.advance.mode === 'auto' &&
        <p className="skip-hint" aria-hidden="true">Click or press Space to continue</p>}
      <div id={HUD_SLOT_ID}/>
      <DialogueBox ref={dialogue} line={snap.line} visible={snap.dialogueVisible} costume={snap.costume}
        expression={speakerExpression} onAdvance={director.advanceLine} onTalkingChange={setTalking} paused={snap.paused}/>
      <SoundToggle/>
      <PauseMenu open={snap.paused} onPause={pause} onResume={resume} currentChapter={chapter.id}
        onRestart={onReplay} onSelectChapter={onSelectChapter} onTitle={onTitle} onCredits={onCredits}/>
      {DevOverlay && <React.Suspense fallback={null}><DevOverlay director={director} snap={snap}/></React.Suspense>}
    </main>
  </StoryActionsContext.Provider>;
}
