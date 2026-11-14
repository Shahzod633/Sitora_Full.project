import type { LayerDef, StageDef, StageId } from '../../story/types';
import { cover, full, siteLayers, siteShots, vignette } from '../shared/marsSite';

// Composition manifest for Chapter 02: seven reusable stages.
//
// Only the observation deck is finished artwork (the artists' three window paintings). Every Mars scene is
// built from labelled placeholder art that can be replaced through data/assetManifest.ts without touching
// this file, as long as the replacement keeps the same framing (see docs/ART_INTEGRATION_GUIDE.md).

/** Invisible camera target inside a painting (x, y, w, h in % of the painting). */
const marker = (id: string, x: number, y: number, w: number, h: number): LayerDef => ({ id, box: { x, y, w: `${w}%`, h: `${h}%` } });

const stars = (depth: number): LayerDef => ({ id: 'stars', asset: 'spaceStars', depth, box: { x: 50, y: 50, w: '134cqw', h: '134cqh' } });

// Engine glow at the nozzle of the artists' Aster (nose right, nozzle on the left).
const thruster: LayerDef = { id: 'asterThrust', fx: 'thruster', props: { single: true }, box: { x: 2, y: 47, w: '10%', h: '24%' } };

export const stages: Record<StageId, StageDef> = {
  // ---------------------------------------------------------------- Observation deck (M01–M03)
  // Three aligned paintings: both mouths closed (base), Eli talking, Mara talking.
  observation: {
    id: 'observation', label: 'Aster observation deck: Earth and the Moon in the window', tone: 'interior', costume: 'deck',
    bounds: 'deck', music: 'interior',
    layers: [
      { id: 'deck', fx: 'talkingPainting', depth: 1, box: cover(2000 / 1126),
        props: { base: 'observationDeck', eli: 'observationDeckEli', mara: 'observationDeckMara' },
        children: [marker('eliO', 23, 50, 16, 76), marker('maraO', 47, 60, 16, 60), marker('moonO', 76, 26, 10, 16), marker('earthO', 46, 66, 70, 40)] },
      vignette(0.2),
    ],
    shots: {
      wide: {},
      establishing: { target: 'moonO', focus: [0.5, 0.5], zoom: 1.5, screen: [0.6, 0.4], portrait: { target: 'moonO', zoom: 1.2, screen: [0.5, 0.34] } },
      settle: { point: [50, 50], zoom: 1.04, portrait: { target: ['eliO', 'maraO'], focus: [0.5, 0.4], zoom: 1 } },
      eliO: { target: 'eliO', focus: [0.5, 0.14], zoom: 1.8, screen: [0.42, 0.36], portrait: { target: 'eliO', focus: [0.5, 0.14], zoom: 1.4, screen: [0.5, 0.34] } },
      maraO: { target: 'maraO', focus: [0.5, 0.1], zoom: 1.8, screen: [0.48, 0.38], portrait: { target: 'maraO', focus: [0.5, 0.1], zoom: 1.4, screen: [0.5, 0.36] } },
      two: { target: ['eliO', 'maraO'], focus: [0.5, 0.3], zoom: 1.3, screen: [0.46, 0.42], portrait: { target: ['eliO', 'maraO'], focus: [0.5, 0.3], zoom: 1.05, screen: [0.5, 0.4] } },
      outward: { target: 'moonO', focus: [0.5, 0.4], zoom: 2.6, screen: [0.5, 0.44], maxZoom: 2.8 },
    },
  },

  // ---------------------------------------------------------------- Deep space to Mars orbit (M04–M05)
  marsSpace: {
    id: 'marsSpace', label: 'Space between Earth and Mars', tone: 'space', costume: 'flight', music: 'space',
    layers: [
      stars(0.05),
      { id: 'sun', fx: 'glow', props: { tone: 'sun' }, depth: 0.1, box: { x: 4, y: 10, w: '70cqmax', h: '70cqmax' }, initial: { opacity: 0.3 } },
      { id: 'marsFar', fx: 'marsGlint', depth: 0.06, box: { x: 80, y: 30, w: '3.4cqmin', h: '3.4cqmin' }, portrait: { x: 76, y: 22 } },
      { id: 'mars', asset: 'marsGlobe', label: 'Mars', depth: 0.4, initial: { opacity: 0 },
        box: { x: 66, y: 52, w: 'min(64cqw, 90cqh)', aspect: 1 }, portrait: { x: 56, y: 38, w: 'min(140cqw, 62cqh)' } },
      { id: 'aster', asset: 'aster', label: 'Aster spacecraft', depth: 1,
        box: { x: 46, y: 56, w: 'min(40cqw, 72cqh)' }, portrait: { x: 50, y: 66, w: '86cqw' }, children: [thruster] },
      vignette(0.2),
    ],
    shots: {
      wide: {},
      cruise: { point: [44, 54], zoom: 1.14, portrait: { point: [48, 60], zoom: 1.1 } },
      ahead: { point: [62, 44], zoom: 1.06, portrait: { point: [58, 40], zoom: 1.05 } },
      orbit: { target: 'mars', focus: [0.5, 0.5], zoom: 1.1 },
      marsNear: { target: 'mars', focus: [0.42, 0.56], zoom: 1.7 },
    },
  },

  // ---------------------------------------------------------------- Atmospheric descent (M06)
  // Unlike the airless Moon, Mars has a thin atmosphere: the ship glows on entry and trails dust.
  marsDescent: {
    id: 'marsDescent', label: 'Aster descending through the thin Martian atmosphere', tone: 'mars', costume: 'flight', music: 'mars',
    layers: [
      { id: 'sky', asset: 'marsDescentSky', label: 'Mars from high altitude', depth: 0.25, box: cover(16 / 9, 1.14) },
      { id: 'haze', fx: 'tint', props: { tone: 'dust' }, depth: 0, box: full, initial: { opacity: 0 } },
      { id: 'aster', asset: 'aster', label: 'Aster', depth: 1,
        box: { x: 50, y: 48, w: 'min(44cqw, 78cqh)' }, portrait: { w: '88cqw' },
        children: [
          { id: 'entryGlow', fx: 'entryGlow', box: { x: 92, y: 56, w: '46%', h: '90%' }, initial: { opacity: 0 } },
          thruster,
        ] },
      vignette(0.35),
    ],
    shots: {
      wide: {},
      entryHigh: { point: [40, 36], zoom: 1.22, portrait: { point: [44, 40], zoom: 1.16 } },
      entryLow: { point: [56, 58], zoom: 1.08, portrait: { point: [54, 56], zoom: 1.06 } },
    },
  },

  // ---------------------------------------------------------------- The Martian plain (M07–M10)
  marsSurface: {
    id: 'marsSurface', label: 'The Martian plain near the Mars Pathfinder landing area', tone: 'mars', costume: 'mars',
    bounds: 'land', music: 'mars',
    layers: [
      { id: 'land', asset: 'marsLandscape', label: 'A wide, dusty Martian plain under a butterscotch sky', depth: 1, box: cover(16 / 9),
        children: [
          { id: 'asterL', asset: 'asterMars', label: 'Aster, landed', box: { x: 74, y: 63, w: '30%', anchor: [0.5, 1] },
            children: [
              thruster,
              { id: 'landingGlow', fx: 'landingGlow', box: { x: 50, y: 100, w: '60%', h: '60%' }, initial: { opacity: 0 } },
            ] },
          // Mars has air: the landing dust billows wide and hangs before it settles.
          { id: 'landingDust', fx: 'dust', box: { x: 74, y: 62, w: '46%', h: '14%' }, initial: { opacity: 0 } },
          { id: 'mound', fx: 'mound', box: { x: 26, y: 79, w: '9%', h: '6%' },
            children: [{ id: 'moundReticle', fx: 'reticle', props: { label: 'Unknown object' }, box: { x: 50, y: 44, w: '150%', h: '190%' }, initial: { opacity: 0 } }] },
          { id: 'scanWave', fx: 'scanWave', box: { x: 37, y: 80, w: '16%', h: '16%' }, initial: { opacity: 0, flags: { flip: true } } },
          { id: 'mara', character: 'mara', label: 'Mara', box: { x: 54, y: 86, h: '26%', anchor: [0.5, 1] }, initial: { opacity: 0, flags: { flip: true } } },
          { id: 'eli', character: 'eli', label: 'Eli', box: { x: 48, y: 87, h: '26.5%', anchor: [0.5, 1] }, initial: { opacity: 0, flags: { flip: true } } },
          { id: 'pip', character: 'pip', label: 'Pip', box: { x: 42, y: 87.5, h: '12%', anchor: [0.5, 1] }, initial: { opacity: 0 } },
        ] },
      { id: 'haze', fx: 'tint', props: { tone: 'dust' }, depth: 0, box: full, initial: { opacity: 0.12 } },
      vignette(0.3),
    ],
    shots: {
      wide: {},
      landingSky: { target: 'asterL', focus: [0.5, -0.9], zoom: 1.25, screen: [0.56, 0.4] },
      landed: { target: 'asterL', focus: [0.5, 0.6], zoom: 1.5, screen: [0.56, 0.54] },
      plain: { target: 'land', focus: [0.5, 0.5], zoom: 1, portrait: { target: ['mara', 'pip'], focus: [0.5, 0.2], zoom: 1 } },
      crewWalk: { target: ['pip', 'mara'], focus: [0.5, 0.4], zoom: 1.7, screen: [0.56, 0.5], portrait: { target: ['pip', 'mara'], focus: [0.5, 0.4], zoom: 1.2, screen: [0.5, 0.46] } },
      pipScan: { target: 'pip', focus: [0.4, 0.3], zoom: 3, screen: [0.56, 0.44] },
      moundFocus: { target: 'mound', focus: [0.5, 0.4], zoom: 2.8, screen: [0.5, 0.44] },
      eliM: { target: 'eli', focus: [0.5, 0.2], zoom: 2.8, screen: [0.5, 0.4] },
      toMound: { target: ['mound', 'eli'], focus: [0.4, 0.5], fill: 0.74, screen: [0.5, 0.48], portrait: { target: ['mound', 'pip'], focus: [0.5, 0.5], fill: 0.9, screen: [0.5, 0.46] } },
    },
  },

  // ---------------------------------------------------------------- The discovery site (M11–M17, M22–M27)
  digSite: {
    id: 'digSite', label: 'The crew beside the half-buried rover', tone: 'mars', costume: 'mars', bounds: 'site', music: 'mars',
    layers: siteLayers({ dust: true }),
    shots: siteShots,
  },

  // ---------------------------------------------------------------- 1997 reconstruction (M18–M21)
  pathfinder: {
    id: 'pathfinder', label: 'Mars Pathfinder, 1997 — reconstruction from the mission archive', tone: 'archive', costume: 'mars', music: 'archive',
    layers: [
      { id: 'backdrop', fx: 'archiveBackdrop', depth: 0, box: full },
      { id: 'recon', asset: 'reconPathfinder', label: 'Illustrated reconstruction of the Mars Pathfinder lander with its petals open', depth: 1,
        box: { x: 46, y: 58, w: 'min(72cqw, 110cqh)' }, portrait: { x: 50, y: 48, w: '140cqw' },
        children: [
          // The rover drives down the ramp: a separate layer, so it can move.
          { id: 'reconRover', asset: 'sojourner', label: 'Illustrated reconstruction of Sojourner on the ramp',
            box: { x: 78, y: 80, w: '17%' }, initial: { opacity: 0, rotation: 26, xp: -60, yp: -40 } },
        ] },
      { id: 'reconLabel', fx: 'label', props: { text: 'Illustrated reconstruction from archived mission data — not footage' }, depth: 0,
        box: { x: 50, y: 93, anchor: [0.5, 1] }, portrait: { y: 82 }, initial: { opacity: 0 } },
      { id: 'missionCard', fx: 'missionCard', props: { title: 'Mars Pathfinder', year: '1997', sub: 'Sojourner Rover' }, depth: 0,
        box: { x: 50, y: 10, anchor: [0.5, 0] }, portrait: { y: 12 }, initial: { opacity: 0 } },
      { id: 'grain', fx: 'filmGrain', depth: 0, box: full },
      vignette(0.9),
      // Last, so the reading panels and the activities sit above grain and vignette and stay fully legible.
      { id: 'recordPanel', fx: 'pathfinderRecord', depth: 0, initial: { opacity: 0 },
        box: { x: 50, y: 47, w: 'min(94cqw, 1120px)', h: 'min(74cqh, 700px)' }, portrait: { y: 50, w: '94cqw', h: '72cqh' } },
      { id: 'roverGame', fx: 'roverGame', depth: 0, initial: { opacity: 0 }, box: full },
      { id: 'timeline', fx: 'missionTimeline', depth: 0, initial: { opacity: 0 },
        box: { x: 50, y: 56, w: 'min(94cqw, 1040px)', h: 'min(76cqh, 720px)' }, portrait: { y: 57, w: '94cqw', h: '78cqh' } },
    ],
    shots: {
      wide: {},
      ramp: { target: 'reconRover', focus: [0.3, 0.3], zoom: 1.5, screen: [0.56, 0.52], portrait: { target: 'reconRover', zoom: 1.2, screen: [0.5, 0.5] } },
    },
  },

  // ---------------------------------------------------------------- Chapter card (M28)
  ending: {
    id: 'ending', label: 'Chapter two complete', tone: 'black', costume: 'mars', music: 'mars',
    layers: [
      { ...stars(0.02), initial: { opacity: 0.3 } },
      { id: 'endCard', fx: 'endCard', depth: 0, box: { x: 50, y: 50 } },
    ],
    shots: { wide: {} },
  },
};
