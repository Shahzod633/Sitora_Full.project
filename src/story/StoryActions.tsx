import React from 'react';

export type StoryActions = {
  interact: (target: string) => void;
  replay: () => void;
  credits: () => void;
  /** Layer id of the hotspot that is currently waiting for the reader, if any. */
  interactionTarget?: string;
  ended: boolean;
};

const noop = () => {};
export const StoryActionsContext = React.createContext<StoryActions>({
  interact: noop, replay: noop, credits: noop, ended: false,
});

export const useStoryActions = () => React.useContext(StoryActionsContext);
