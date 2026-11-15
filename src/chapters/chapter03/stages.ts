import type { LayerDef, StageDef, StageId } from '../../story/types';
import { cover, full, siteLayers, siteShots, vignette } from '../shared/marsSite';

// Composition manifest for Chapter 03: four stages.
//
// `legacySite` is the discovery site from Chapter 2 (same paintings, same positions) at dusk, with the extra
// poses this chapter needs: Mara kneeling, Mara saluting and Pip with his arms out to carry the rover.
// Sojourner is always its own layer: Pip lifts it with his hands, it never floats and never merges with him.

const stars = (depth: number, opacity = 1): LayerDef => ({
  id: 'stars', asset: 'spaceStars', depth, box: { x: 50, y: 50, w: '134cqw', h: '134cqh' }, initial: { opacity },
});

/** Mara's position beside the rover after she walks over (L06). The kneeling and saluting poses sit here. */
const MARA_AT_ROVER = 36.6;

export const stages: Record<StageId, StageDef> = {
  // ---------------------------------------------------------------- The discovery site at dusk (L01–L13)
  legacySite: {
    id: 'legacySite', label: 'The crew and the little rover on the Martian plain at dusk', tone: 'dusk', costume: 'mars',
    bounds: 'site', music: 'mars',
    layers: [
      ...siteLayers({
        dust: false,
        siteExtras: [
          { id: 'maraKneel', asset: 'maraKneel', label: 'Mara kneeling beside Sojourner', box: { x: 39.5, y: 91.5, h: '34%', anchor: [0.5, 1] }, initial: { opacity: 0 } },
          { id: 'maraSalute', asset: 'maraSalute', label: 'Mara saluting Sojourner', box: { x: MARA_AT_ROVER, y: 91, h: '50%', anchor: [0.5, 1] }, initial: { opacity: 0 } },
          { id: 'pipCarry', asset: 'pipCarry', label: 'Pip holding out his arms for Sojourner', box: { x: 57.5, y: 92, h: '23%', anchor: [0.5, 1] }, initial: { opacity: 0 } },
        ],
      }),
      // Evening light over both paintings, and the cool glow the holograms throw.
      { id: 'duskLight', fx: 'tint', props: { tone: 'dusk' }, depth: 0, box: full, initial: { opacity: 0.55 } },
      { id: 'holoGlow', fx: 'tint', props: { tone: 'holo' }, depth: 0, box: full, initial: { opacity: 0 } },
      // The crew display (fictional): a quiet card at the top of the frame.
      { id: 'crewDisplay', fx: 'crewDisplay', depth: 0, box: { x: 50, y: 14, anchor: [0.5, 0] }, portrait: { y: 16 }, initial: { opacity: 0 } },
      // Last, so the reading panel sits above everything and stays fully legible.
      { id: 'roverTimeline', fx: 'roverTimeline', depth: 0, initial: { opacity: 0 },
        box: { x: 50, y: 56, w: 'min(95cqw, 1120px)', h: 'min(76cqh, 720px)' }, portrait: { y: 57, w: '95cqw', h: '78cqh' } },
    ],
    shots: siteShots,
  },

  // ---------------------------------------------------------------- Martian sunset (L14–L15)
  // One wide painting. The crew, the rover and the ship are separate, darkened layers, so they read as
  // silhouettes against the sky and can walk while the camera pulls back.
  sunset: {
    id: 'sunset', label: 'The crew walking toward Aster across the Martian plain at sunset, Pip carrying Sojourner', tone: 'dusk',
    costume: 'mars', bounds: 'plain', music: 'finale',
    layers: [
      { id: 'plain', asset: 'marsSunset', label: 'A wide Martian plain under a sunset sky', depth: 1, box: cover(16 / 9),
        children: [
          { id: 'asterS', asset: 'aster', label: 'Aster in the distance', box: { x: 80, y: 68, w: '28%', anchor: [0.5, 1] }, initial: { brightness: 0.32 } },
          { id: 'maraW', asset: 'maraMars', label: 'Mara', box: { x: 27, y: 88, h: '25%', anchor: [0.5, 1] }, initial: { brightness: 0.34 } },
          // Eli is drawn facing left: mirrored so all three walk toward the ship.
          { id: 'eliW', asset: 'eliMars', label: 'Eli', box: { x: 34, y: 89, h: '25.5%', anchor: [0.5, 1] }, initial: { brightness: 0.34, flags: { flip: true } } },
          // Pip carries the rover against his chest (its own layer; no carrying pose has been drawn yet).
          { id: 'pipW', asset: 'pipMars', label: 'Pip', box: { x: 41, y: 89.5, w: '2.63%', h: '11.5%', anchor: [0.5, 1] }, initial: { brightness: 0.36 },
            children: [
              { id: 'roverW', asset: 'sojourner', label: 'Sojourner, carried by Pip', box: { x: 60, y: 58, w: '150%', h: '51%' }, initial: { brightness: 0.9 } },
            ] },
          { id: 'skyMark', box: { x: 50, y: 8, w: '40%', h: '10%' } },
        ] },
      { id: 'nightFall', fx: 'tint', props: { tone: 'black' }, depth: 0, box: full, initial: { opacity: 0 } },
      vignette(0.4),
    ],
    shots: {
      wide: {},
      walkNear: { target: ['maraW', 'pipW'], focus: [0.6, 0.4], zoom: 2.3, screen: [0.46, 0.54], portrait: { target: ['maraW', 'pipW'], focus: [0.6, 0.4], zoom: 1.5, screen: [0.5, 0.5] } },
      pullBack: { target: 'plain', focus: [0.5, 0.5], zoom: 1, portrait: { target: ['maraW', 'asterS'], focus: [0.5, 0.4], zoom: 1 } },
      sky: { target: 'skyMark', focus: [0.5, 0.5], zoom: 1.5, screen: [0.5, 0.3] },
    },
  },

  // ---------------------------------------------------------------- The line of knowledge (L16–L17)
  legacy: {
    id: 'legacy', label: 'Historic missions connected by a glowing line', tone: 'black', costume: 'mars', music: 'finale',
    layers: [
      stars(0.03, 0.55),
      { id: 'line', fx: 'legacyLine', depth: 0, box: full, initial: { opacity: 0, vars: { p: 0 } } },
      { id: 'words1', fx: 'titleLine', props: { text: 'They were left behind.' }, depth: 0, box: { x: 50, y: 44 }, initial: { opacity: 0 } },
      { id: 'words2', fx: 'titleLine', props: { text: 'But not forgotten.' }, depth: 0, box: { x: 50, y: 56 }, initial: { opacity: 0 } },
    ],
    shots: { wide: {} },
  },

  // ---------------------------------------------------------------- The end (L18)
  finale: {
    id: 'finale', label: 'Abandoned But Not Forgotten — the end', tone: 'black', costume: 'mars', music: 'finale',
    layers: [
      stars(0.02, 0.3),
      { id: 'finalTitle', fx: 'finalTitle', depth: 0, box: { x: 50, y: 50 } },
    ],
    shots: { wide: {} },
  },
};
