import type React from 'react';

// Chapters contribute their own effect layers and activities (dust brushing, the rover drive, timelines…)
// without touching the engine: `registerFx('dustReveal', DustReveal)` in the chapter's index module, then
// `{ id: 'dust', fx: 'dustReveal', … }` in its stages. The component is rendered inside the layer box.

export type FxProps = {
  /** Layer id. Activities compare it with `useStoryActions().interactionTarget` to know they are live,
   * and call `interact(id)` when the reader has completed them. */
  id: string;
  props: Record<string, string | number | boolean>;
};

const registry = new Map<string, React.ComponentType<FxProps>>();

export function registerFx(kind: string, component: React.ComponentType<FxProps>) {
  registry.set(kind, component);
}

export const lookupFx = (kind: string) => registry.get(kind);
