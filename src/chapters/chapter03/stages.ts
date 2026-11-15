import type { LayerDef, StageDef, StageId } from '../../story/types';
import { cover, full, siteLayers, siteShots, vignette } from '../shared/marsSite';

// Composition manifest for Chapter 03: four stages.
//
// `legacySite` is the discovery site from Chapter 2 (same paintings, same positions) at dusk, with the extra
// poses this chapter needs: Mara kneeling, Mara saluting and Pip with his arms out to carry the rover.
// The carrying illustration includes Sojourner, keeping both hands attached to their load.

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
          { id: 'pipCarry', asset: 'pipCarry', label: 'Pip supporting Sojourner with both hands', box: { x: 57.5, y: 92, h: '23%', anchor: [0.5, 1] }, initial: { opacity: 0 } },
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
    shots: {
      ...siteShots,
      pipHolding: { target: 'pipCarry', focus: [0.5, 0.5], zoom: 2.6, screen: [0.5, 0.44], portrait: { zoom: 2, screen: [0.5, 0.4] } },
    },
  },

  // ---------------------------------------------------------------- Martian sunset (L14–L15)
  // No walk-cycle art is available. Keep the crew planted while the camera pulls back.
  // The landscape contains no figures; every passenger is rendered exactly once below.
  sunset: {
    id: 'sunset', label: 'The crew facing Aster on the Martian plain at sunset, Pip holding Sojourner', tone: 'dusk',
    costume: 'mars', bounds: 'plain', music: 'finale',
    layers: [
      { id: 'plain', asset: 'marsSunset', label: 'A wide Martian plain under a sunset sky', depth: 1, box: cover(16 / 9) },
      { id: 'asterS', asset: 'aster', label: 'Aster in the distance', depth: 1,
        box: { x: 79, y: 67, w: '26cqw', h: '18cqh', anchor: [0.5, 1] },
        portrait: { x: 73, y: 65, w: '48cqw', h: '14cqh' }, initial: { brightness: 0.65 } },
      // Viewport-relative group instead of children of a cover-cropped landscape: all boots and
      // the carried rover fit on narrow phones too. Children share the same camera plane.
      { id: 'returnParty', depth: 1,
        box: { x: 43, y: 85, w: 'min(48cqw, 70cqh)', aspect: 1.6, anchor: [0.5, 1] },
        portrait: { x: 46, y: 81, w: '82cqw' },
        children: [
          { id: 'maraShadow', fx: 'shadow', box: { x: 18, y: 99, w: '22%', h: '3%' }, initial: { opacity: 0.65 } },
          { id: 'eliShadow', fx: 'shadow', box: { x: 47, y: 99, w: '22%', h: '3%' }, initial: { opacity: 0.65 } },
          { id: 'pipShadow', fx: 'shadow', box: { x: 78, y: 99, w: '18%', h: '3%' }, initial: { opacity: 0.65 } },
          { id: 'maraW', asset: 'maraMars', label: 'Mara', box: { x: 18, y: 100, w: '18%', h: '100%', anchor: [0.5, 1] }, initial: { brightness: 0.7 } },
          { id: 'eliW', asset: 'eliMars', label: 'Eli', box: { x: 47, y: 100, w: '19%', h: '100%', anchor: [0.5, 1] }, initial: { brightness: 0.7, flags: { flip: true } } },
          // One carrying sprite keeps the grip intact at every viewport size.
          { id: 'pipW', asset: 'pipCarry', label: 'Pip supporting Sojourner with both hands', box: { x: 78, y: 100, h: '50%', anchor: [0.5, 1] }, initial: { brightness: 0.7 } },
        ] },
      { id: 'nightFall', fx: 'tint', props: { tone: 'black' }, depth: 0, box: full, initial: { opacity: 0 } },
      vignette(0.4),
    ],
    shots: {
      wide: {},
      returnNear: { point: [50, 58], zoom: 1.08 },
      pullBack: { point: [50, 50], zoom: 1 },
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
