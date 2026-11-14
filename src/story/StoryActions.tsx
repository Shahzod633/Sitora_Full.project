import React from 'react';
import type { CharacterId } from '../data/characters';

export type StoryActions = {
  interact: (target: string) => void;
  replay: () => void;
  credits: () => void;
  /** Layer id of the hotspot that is currently waiting for the reader, if any. */
  interactionTarget?: string;
  ended: boolean;
  /** Character whose line is typing out right now (mouth moving), or null. */
  talking: CharacterId | null;
};

const noop = () => {};
export const StoryActionsContext = React.createContext<StoryActions>({
  interact: noop, replay: noop, credits: noop, ended: false, talking: null,
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
