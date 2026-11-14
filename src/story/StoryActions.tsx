import React from 'react';
import type { CharacterId } from '../data/characters';
import type { ChapterEnding } from './types';

export type StoryActions = {
  /** Activate a hotspot or report that the activity rendered by layer `target` is complete. */
  interact: (target: string) => void;
  /** Restart the current chapter. */
  replay: () => void;
  /** Restart the whole story from Chapter 1. */
  replayStory: () => void;
  /** Continue to the next chapter, when there is one. */
  next?: () => void;
  credits: () => void;
  /** Layer id of the hotspot or activity that is currently waiting for the reader, if any. */
  interactionTarget?: string;
  ended: boolean;
  paused: boolean;
  /** Portrait viewport (taller than wide): activities recompose for it. */
  portrait: boolean;
  /** Character whose line is typing out right now (mouth moving), or null. */
  talking: CharacterId | null;
  chapter?: { number: string; title: string; ending?: ChapterEnding; nextNumber?: string };
};

const noop = () => {};
export const StoryActionsContext = React.createContext<StoryActions>({
  interact: noop, replay: noop, replayStory: noop, credits: noop, ended: false, paused: false, portrait: false, talking: null,
});

export const useStoryActions = () => React.useContext(StoryActionsContext);

const FLAP_MS = 120;

/** Lip flap for painted artwork: alternates open/closed while `character` is talking, closed otherwise. */
export function useMouthOpen(character: CharacterId | undefined) {
  const { talking } = useStoryActions();
  const active = !!character && talking === character;
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!active) {
      setOpen(false);
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOpen(true);
      return;
    }
    setOpen(true);
    const id = window.setInterval(() => setOpen(o => !o), FLAP_MS);
    return () => window.clearInterval(id);
  }, [active]);
  return open;
}
