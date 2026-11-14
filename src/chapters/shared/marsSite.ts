import type { Box, CameraShot, LayerDef } from '../../story/types';

// The place where the crew finds Sojourner. Chapters 2 and 3 share it so the art slots, character positions
// and camera shots are identical in both.
//
// Like the Moon in Chapter 1 it is built from two paintings that the story cuts between:
//   `site`       — medium-wide: the crew standing around the small rover (who is speaking)
//   `closeScene` — close on the rover in the dust (what they are looking at): dust brushing, the reveal,
//                  the nameplate
// Characters, the rover and the holograms are child layers placed in % of their painting, so camera framing
// stays aligned with the artwork on every screen.

const ASPECT = 16 / 9;

/** Cover the viewport with a painting of `aspect`. */
export const cover = (aspect: number, k = 1): Box => ({
  x: 50, y: 50, w: `max(${100 * k}cqw, calc(${100 * k}cqh * ${aspect.toFixed(4)}))`, aspect, anchor: [0.5, 0.5],
});

export const full: Box = { x: 50, y: 50, w: '100cqw', h: '100cqh' };

export const vignette = (opacity = 0): LayerDef => ({ id: 'vignette', fx: 'vignette', depth: 0, box: full, initial: { opacity } });

type SiteOptions = {
  /** Chapter 2: the rover starts buried and the reader brushes the dust away. */
  dust: boolean;
  /** Extra child layers of the wide painting (poses that only one chapter needs). */
  siteExtras?: LayerDef[];
};

export function siteLayers({ dust, siteExtras = [] }: SiteOptions): LayerDef[] {
  return [
    { id: 'site', asset: 'marsDigSite', label: 'The crew on the Martian plain beside a small, half-buried rover', depth: 1,
      box: cover(ASPECT),
      children: [
        { id: 'holo', fx: 'holoRow', box: { x: 50, y: 25, w: '80%', h: '30%' }, initial: { opacity: 0, vars: { n: 0 } } },
        { id: 'mara', character: 'mara', label: 'Mara', box: { x: 29, y: 91, h: '50%', anchor: [0.5, 1] } },
        { id: 'eli', character: 'eli', label: 'Eli', box: { x: 69, y: 92, h: '51%', anchor: [0.5, 1] }, initial: { flags: { flip: true } } },
        { id: 'pip', character: 'pip', label: 'Pip', box: { x: 57.5, y: 92, h: '23%', anchor: [0.5, 1] },
          children: [
            { id: 'pipThinking', fx: 'pipStatus', props: { mode: 'thinking' }, box: { x: 96, y: 22, anchor: [0, 0.5] }, initial: { opacity: 0 } },
          ] },
        { id: 'roverS', asset: 'sojourner', label: 'Sojourner', box: { x: 46.5, y: 91, w: '12%', anchor: [0.5, 1] },
          children: [
            { id: 'scanReticle', fx: 'reticle', props: { label: 'Suit computer · archive search' },
              box: { x: 50, y: 50, w: '130%', h: '140%' }, initial: { opacity: 0 } },
          ] },
        ...siteExtras,
      ] },
    { id: 'closeScene', asset: 'marsCloseUp', label: 'Close view of the rover in the Martian dust', depth: 1, initial: { opacity: 0 },
      box: cover(ASPECT),
      children: [
        { id: 'roverL', asset: 'sojourner', label: 'Sojourner, the Mars Pathfinder rover', box: { x: 50, y: 52, w: '46%' }, portrait: { w: '24%' },
          children: [
            // Sits on the plate drawn on the rover's side (see sojourner.svg / the final rover art).
            { id: 'plate', fx: 'nameplate', box: { x: 49, y: 64.6, w: '27%', h: '7.5%' }, initial: { vars: { wipe: 0 } } },
          ] },
        ...(dust ? [{ id: 'dustCover', fx: 'dustReveal', box: { x: 50, y: 52, w: '70%', h: '74%' }, portrait: { w: '36.5%', h: '39%' } } as LayerDef] : []),
        { id: 'revealTag', fx: 'nameTag', props: { name: 'Sojourner', role: 'Mars Pathfinder rover · 1997' },
          box: { x: 50, y: 20, anchor: [0.5, 1] }, portrait: { y: 34 }, initial: { opacity: 0 } },
      ] },
    // A cool wash for the moment the suit computer's display flickers.
    { id: 'flicker', fx: 'tint', props: { tone: 'archive' }, depth: 0, box: full, initial: { opacity: 0 } },
    vignette(0.3),
  ];
}

export const siteShots: Record<string, CameraShot> = {
  wide: {},
  siteWide: { target: 'site', zoom: 1, portrait: { target: ['mara', 'eli'], focus: [0.5, 0.5], zoom: 1 } },
  crew: { target: ['mara', 'eli'], focus: [0.5, 0.42], fill: 0.86, screen: [0.5, 0.46] },
  maraS: { target: 'mara', focus: [0.5, 0.16], zoom: 2, screen: [0.46, 0.38], portrait: { target: 'mara', focus: [0.5, 0.16], zoom: 1.5, screen: [0.5, 0.34] } },
  eliS: { target: 'eli', focus: [0.5, 0.16], zoom: 2, screen: [0.54, 0.38], portrait: { target: 'eli', focus: [0.5, 0.16], zoom: 1.5, screen: [0.5, 0.34] } },
  pipS: { target: 'pip', focus: [0.5, 0.3], zoom: 2.6, screen: [0.5, 0.42], portrait: { target: 'pip', focus: [0.5, 0.3], zoom: 2, screen: [0.5, 0.4] } },
  pipCloser: { target: 'pip', focus: [0.5, 0.26], zoom: 3, screen: [0.5, 0.42], portrait: { target: 'pip', focus: [0.5, 0.26], zoom: 2.4, screen: [0.5, 0.4] } },
  pipRover: { target: ['roverS', 'pip'], focus: [0.5, 0.5], fill: 0.5, screen: [0.5, 0.44], portrait: { target: ['roverS', 'pip'], focus: [0.5, 0.5], fill: 0.9, screen: [0.5, 0.42] } },
  roverSmall: { target: 'roverS', focus: [0.5, 0.5], fill: 0.36, screen: [0.5, 0.48], portrait: { target: 'roverS', fill: 0.7, screen: [0.5, 0.44] } },
  maraRover: { target: ['mara', 'roverS'], focus: [0.5, 0.5], fill: 0.78, screen: [0.5, 0.46] },
  eliPip: { target: ['pip', 'eli'], focus: [0.5, 0.4], fill: 0.8, screen: [0.5, 0.46] },
  holoView: { target: 'holo', focus: [0.5, 0.6], fill: 0.94, screen: [0.5, 0.42], portrait: { target: 'holo', focus: [0.5, 0.6], zoom: 1, screen: [0.5, 0.4] } },
  closeWide: { target: 'closeScene', zoom: 1, bounds: 'closeScene' },
  closeRover: { target: 'roverL', focus: [0.5, 0.5], fill: 0.5, screen: [0.5, 0.42], bounds: 'closeScene' },
  closePush: { target: 'roverL', focus: [0.5, 0.5], fill: 0.9, screen: [0.5, 0.44], bounds: 'closeScene' },
  plate: { target: 'plate', focus: [0.5, 0.5], fill: 0.6, screen: [0.5, 0.42], maxZoom: 3.4, bounds: 'closeScene' },
};
