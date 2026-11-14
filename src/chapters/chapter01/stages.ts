import type { Box, LayerDef, StageDef, StageId } from '../../story/types';

// Composition manifest for Chapter 01: six reusable stages.
//
// The cockpit, the Moon conversation and the Aster hero frame are the artists' paintings. Each painting is
// one layer that covers the viewport at its exact aspect ratio; characters, the lander, the window and the
// hotspot are child markers placed in % of the painting, so camera framing and hotspots stay aligned on
// every screen. Beats only change layer states and camera framing.
//
// Boxes use container units (cqw/cqh/cqmin). `portrait` boxes recompose for phones held upright.
// `depth` drives parallax: 0 is fixed to the screen, 1 moves with the camera.

const full = { x: 50, y: 50, w: '100cqw', h: '100cqh' };

/** Cover the viewport with a painting of `aspect`, `k` × larger. anchorY 1 pins the bottom edge (crops the top). */
const cover = (aspect: number, k = 1, anchorY = 0.5): Box => ({
  x: 50, y: anchorY === 1 ? 100 : 50, w: `max(${100 * k}cqw, calc(${100 * k}cqh * ${aspect.toFixed(4)}))`, aspect, anchor: [0.5, anchorY],
});

/** Invisible camera target inside a painting (x, y, w, h in % of the painting). */
const marker = (id: string, x: number, y: number, w: number, h: number, children?: LayerDef[]): LayerDef => ({
  id, box: { x, y, w: `${w}%`, h: `${h}%` }, children,
});

const stars = (depth: number, y = 50): LayerDef => ({
  id: 'stars', asset: 'spaceStars', depth, box: { x: 50, y, w: '134cqw', h: '134cqh' },
});

const vignette = (opacity = 0): LayerDef => ({
  id: 'vignette', fx: 'vignette', depth: 0, box: full, initial: { opacity },
});

// Engine glow at the nozzle of the artists' Aster (nose right, nozzle on the left).
const thruster: LayerDef = { id: 'asterThrust', fx: 'thruster', props: { single: true }, box: { x: 2, y: 47, w: '10%', h: '24%' } };

export const stages: Record<StageId, StageDef> = {
  // ---------------------------------------------------------------- Space (B01–B04, B14, B32)
  orbit: {
    id: 'orbit', label: 'Space between Earth and the Moon', tone: 'space', costume: 'flight',
    layers: [
      stars(0.05),
      { id: 'sun', fx: 'glow', props: { tone: 'sun' }, depth: 0.1, box: { x: 94, y: 6, w: '86cqmax', h: '86cqmax' }, initial: { opacity: 0.4 } },
      { id: 'mars', fx: 'marsGlint', depth: 0.06, box: { x: 86, y: 20, w: '3.2cqmin', h: '3.2cqmin' }, portrait: { x: 82, y: 14 }, initial: { opacity: 0 } },
      { id: 'earth', asset: 'earth', label: 'Earth', depth: 0.3,
        box: { x: 67, y: 50, w: 'min(68cqw, 92cqh)', aspect: 1 }, portrait: { x: 54, y: 34, w: 'min(150cqw, 66cqh)' } },
      { id: 'moon', asset: 'moonGlobe', label: 'The Moon', depth: 0.42, initial: { opacity: 0 },
        box: { x: 30, y: 50, w: 'min(62cqw, 88cqh)', aspect: 1 }, portrait: { x: 46, y: 40, w: 'min(136cqw, 66cqh)' } },
      { id: 'aster', asset: 'aster', label: 'Aster spacecraft', depth: 1, initial: { opacity: 0 },
        box: { x: 46, y: 58, w: 'min(46cqw, 82cqh)' }, portrait: { x: 50, y: 64, w: '94cqw' }, children: [thruster] },
      // Artists' hero frame of Aster with Earth. Fades in at the end of B03; B04 pushes into its windows.
      { id: 'hero', asset: 'asterSpace', label: 'Aster in space with Earth', depth: 1, initial: { opacity: 0 },
        box: cover(1672 / 941), children: [marker('heroWindow', 82, 50, 10, 10)] },
      vignette(),
    ],
    shots: {
      wide: {},
      earthNear: { point: [64, 50], zoom: 1.16, portrait: { point: [54, 38], zoom: 1.12 } },
      earthDrift: { point: [57, 51], zoom: 1.06, portrait: { point: [50, 42], zoom: 1.05 } },
      distant: { point: [26, 42], zoom: 1.1, portrait: { point: [30, 44], zoom: 1.1 } },
      reveal: { point: [50, 55], zoom: 1.06, portrait: { point: [50, 58], zoom: 1.06 } },
      heroDrift: { target: 'hero', focus: [0.62, 0.5], zoom: 1.08, bounds: 'hero' },
      intoWindow: { target: 'heroWindow', zoom: 4.2, maxZoom: 4.4, bounds: 'hero' },
      lunarApproach: { target: 'moon', focus: [0.5, 0.5], zoom: 1.08 },
      lunarSurface: { target: 'moon', focus: [0.44, 0.6], zoom: 1.75 },
      departNear: { point: [36, 60], zoom: 1.3, portrait: { point: [40, 56], zoom: 1.26 } },
    },
  },

  // ---------------------------------------------------------------- Aster flight deck (B05–B13)
  // Two paintings of the same deck: `wide` (Mara seated, Eli standing, Earth in the window) and `twoShot`
  // (close two-shot with closed-mouth base frame + Mara/Eli talking frames for lip-sync).
  cockpit: {
    id: 'cockpit', label: 'Aster flight deck', tone: 'interior', costume: 'flight', bounds: 'wide',
    layers: [
      { id: 'wide', asset: 'cockpitWide', label: 'Aster flight deck: Mara at navigation, Eli by the window', depth: 1,
        box: cover(2000 / 1125),
        children: [
          marker('maraMark', 27, 52, 14, 30),
          marker('eliMark', 83.5, 58, 11, 60),
          marker('windowMark', 53, 36, 30, 36),
          { id: 'windowMoon', asset: 'moonGlobe', label: 'The Moon through the window', box: { x: 43, y: 30, w: '4.5%', aspect: 1 }, initial: { opacity: 0, scale: 0.5 } },
          // Pip is not painted in the cockpit yet: temporary figure standing on the deck between them.
          { id: 'pip', character: 'pip', label: 'Pip', box: { x: 55, y: 86, h: '25%', anchor: [0.5, 1] },
            children: [{ id: 'pipDiag', fx: 'pipDiag', box: { x: 128, y: 34, w: '78%', h: '40%' }, initial: { opacity: 0 } }] },
          { id: 'tagMara', fx: 'nameTag', props: { name: 'Mara', role: 'Captain · reviewing the flight route' },
            box: { x: 35, y: 40, anchor: [0, 0.5] }, initial: { opacity: 0 } },
          { id: 'tagEli', fx: 'nameTag', props: { name: 'Eli', role: 'Engineer · looking at Earth' },
            box: { x: 76, y: 30, anchor: [1, 0.5] }, initial: { opacity: 0 } },
          { id: 'tagPip', fx: 'nameTag', props: { name: 'Pip', role: 'Checking the ship’s systems' },
            box: { x: 55, y: 58, anchor: [0.5, 1] }, initial: { opacity: 0 } },
        ] },
      { id: 'twoShot', fx: 'talkingPainting', depth: 1, initial: { opacity: 0 },
        props: { base: 'cockpitTwoShot', mara: 'cockpitTwoShotMara', eli: 'cockpitTwoShotEli' },
        box: cover(2000 / 1125),
        children: [marker('twoEli', 28.2, 30, 9, 16), marker('twoMara', 31.5, 50, 9, 16)] },
      { id: 'consoleGlow', fx: 'glow', props: { tone: 'amber' }, depth: 1, initial: { opacity: 0 },
        box: { x: 50, y: 70, w: '112cqw', h: '56cqh' } },
      { id: 'hud', fx: 'hud', props: { system: 'Aster flight computer', title: 'Approaching the Moon' }, depth: 0,
        box: { x: 50, y: 15, anchor: [0.5, 0] }, initial: { opacity: 0 } },
      vignette(),
    ],
    shots: {
      wide: {},
      establishing: { point: [50, 52], zoom: 1.05 },
      windowIn: { target: 'windowMark', zoom: 2.1, portrait: { target: 'windowMark', zoom: 1.5 } },
      maraIntro: { target: 'maraMark', focus: [0.5, 0.35], zoom: 1.8, screen: [0.42, 0.48] },
      eliIntro: { target: 'eliMark', focus: [0.5, 0.3], zoom: 1.8, screen: [0.58, 0.46] },
      pipIntro: { target: 'pip', focus: [0.62, 0.42], zoom: 2.1, screen: [0.46, 0.5] },
      pipClose: { target: 'pip', focus: [0.55, 0.3], zoom: 2.6, screen: [0.48, 0.4] },
      pipMara: { target: ['maraMark', 'pip'], focus: [0.5, 0.42], fill: 0.9, screen: [0.5, 0.44] },
      moonWindow: { target: 'windowMoon', zoom: 2.3, screen: [0.5, 0.42] },
      twoBoth: { target: ['twoEli', 'twoMara'], focus: [0.5, 0.5], zoom: 1.35, screen: [0.42, 0.42], portrait: { target: ['twoEli', 'twoMara'], zoom: 1.2, screen: [0.5, 0.42] } },
      twoEli: { target: 'twoEli', zoom: 1.9, screen: [0.44, 0.38], portrait: { target: 'twoEli', zoom: 1.6, screen: [0.5, 0.36] } },
      twoEliClose: { target: 'twoEli', zoom: 2.2, screen: [0.46, 0.38], portrait: { target: 'twoEli', zoom: 1.8, screen: [0.5, 0.36] } },
      twoMara: { target: 'twoMara', zoom: 1.9, screen: [0.44, 0.42], portrait: { target: 'twoMara', zoom: 1.6, screen: [0.5, 0.4] } },
    },
  },

  // ---------------------------------------------------------------- Fictional lunar refuelling station (B15, B16, B31)
  lunarBase: {
    id: 'lunarBase', label: 'A fictional future lunar base and refuelling pad', tone: 'moon', costume: 'flight',
    layers: [
      stars(0.04, 34),
      { id: 'skyEarth', asset: 'earth', label: 'Earth in the lunar sky', depth: 0.12,
        box: { x: 82, y: 14, w: 'min(8cqw, 14cqh)', aspect: 1 }, portrait: { x: 78, y: 10, w: '18cqw' } },
      { id: 'ground', asset: 'moonSurface', label: 'Lunar surface', depth: 1,
        box: { x: 50, y: 100, w: '104cqw', h: '62cqh', anchor: [0.5, 1] }, portrait: { w: '230cqw', h: '56cqh' } },
      { id: 'baseGlow', fx: 'glow', props: { tone: 'amber' }, depth: 1, initial: { opacity: 0.45 },
        box: { x: 38, y: 58, w: '72cqw', h: '26cqh' }, portrait: { x: 34, y: 56, w: '150cqw' } },
      { id: 'facility', asset: 'lunarBase', label: 'Lunar facility', depth: 1,
        box: { x: 36, y: 63, w: '62cqw', anchor: [0.5, 0.94] }, portrait: { x: 30, y: 60, w: '140cqw' } },
      { id: 'pad', fx: 'landingPad', depth: 1, box: { x: 63, y: 70, w: '28cqw', h: '5cqw' }, portrait: { x: 60, y: 66, w: '66cqw', h: '12cqw' } },
      { id: 'gantry', asset: 'refuelGantry', label: 'Refuelling gantry', depth: 1, initial: { flags: { flip: true } },
        box: { x: 83, y: 71, h: '30cqh', anchor: [0.77, 0.97] }, portrait: { x: 92, y: 67, h: '19cqh' } },
      { id: 'aster', asset: 'aster', label: 'Aster', depth: 1,
        box: { x: 62, y: 69, w: 'min(28cqw, 50cqh)', anchor: [0.5, 0.96] }, portrait: { x: 58, y: 65, w: '66cqw' },
        children: [thruster, { id: 'landingGlow', fx: 'landingGlow', box: { x: 50, y: 100, w: '50%', h: '50%' }, initial: { opacity: 0 } }] },
      { id: 'dust', fx: 'dust', depth: 1, box: { x: 63, y: 69, w: '34cqw', h: '8cqh' }, portrait: { x: 58, y: 65, w: '80cqw' }, initial: { opacity: 0 } },
      { id: 'refuelLine', fx: 'refuelLine', depth: 1, box: { x: 74, y: 58.5, w: '3cqmin', h: '3cqmin' }, portrait: { x: 77, y: 56 }, initial: { opacity: 0 } },
      { id: 'refuelStatus', fx: 'statusTag', props: { label: 'Refueling' }, depth: 1,
        box: { x: 80, y: 43.5, anchor: [1, 1] }, portrait: { x: 88, y: 45 }, initial: { opacity: 0, vars: { progress: 0 } } },
      vignette(),
    ],
    shots: {
      wide: {},
      descentHigh: { point: [52, 28], zoom: 1.32, portrait: { point: [50, 30], zoom: 1.2 } },
      descentTrack: { point: [58, 52], zoom: 1.14, portrait: { point: [56, 52], zoom: 1.12 } },
      landed: { point: [56, 58], zoom: 1.08, portrait: { point: [56, 56], zoom: 1.08 } },
      refuel: { target: ['aster', 'gantry'], focus: [0.5, 0.45], fill: 0.92 },
      liftoffNear: { point: [60, 58], zoom: 1.2, portrait: { point: [58, 56], zoom: 1.16 } },
      liftoffSky: { point: [62, 32], zoom: 1.12, portrait: { point: [58, 32], zoom: 1.1 } },
    },
  },

  // ---------------------------------------------------------------- The Moon, today (B17–B23, B26–B30)
  // Two paintings: `crewScene` (Mara, Eli and Pip in EVA gear by the base) and `apolloScene` (the Apollo 11
  // descent stage). Lines alternate between them: the crew when they speak, the lander when it is the subject.
  apolloSite: {
    id: 'apolloSite', label: 'The Apollo 11 landing site on the Moon', tone: 'moon', costume: 'eva', bounds: 'crewScene',
    layers: [
      // Pinned to the bottom and 8 % oversized so the source's top-right window icons stay off-screen.
      { id: 'crewScene', asset: 'moonCrewPainting', label: 'Mara, Eli and Pip on the lunar surface near the base', depth: 1,
        box: cover(1721 / 914, 1.08, 1),
        children: [
          marker('maraM', 28, 56, 11, 64),
          marker('eliM', 45, 69, 20, 38),
          marker('pipM', 64, 76, 14, 24),
          marker('baseM', 76, 46, 40, 26),
          { id: 'pipThinking', fx: 'pipStatus', props: { mode: 'thinking' }, box: { x: 67, y: 68, anchor: [0, 0.5] }, initial: { opacity: 0 } },
          { id: 'pipSaved', fx: 'pipStatus', props: { mode: 'saved', text: 'Saved to memory' }, box: { x: 67, y: 68, anchor: [0, 0.5] }, initial: { opacity: 0 } },
        ] },
      { id: 'apolloScene', asset: 'apolloPainting', label: 'The Apollo 11 descent stage on the lunar surface', depth: 1, initial: { opacity: 0 },
        box: cover(1672 / 941),
        children: [
          marker('apollo', 38.5, 50, 28, 40, [
            { id: 'apolloReticle', fx: 'reticle', props: { label: 'Scan · no contact' }, box: { x: 50, y: 50, w: '124%', h: '128%' }, initial: { opacity: 0 } },
            { id: 'apolloHotspot', fx: 'hotspot', props: { label: 'Apollo 11 landing site', hint: 'Look back to 1969' },
              box: { x: 50, y: 52, w: '70%', h: '80%' }, initial: { opacity: 0 } },
          ]),
          // Pip's scan arrives from off-screen and fades well before the historic site.
          { id: 'scanWave', fx: 'scanWave', box: { x: 10, y: 86, w: '30%', h: '28%' }, initial: { opacity: 0 } },
        ] },
      vignette(),
    ],
    shots: {
      wide: {},
      crewArrive: { target: 'crewScene', focus: [0.3, 0.6], zoom: 1.3, portrait: { target: 'crewScene', focus: [0.36, 0.6], zoom: 1.05 } },
      crewGroup: { target: ['maraM', 'pipM'], focus: [0.5, 0.45], fill: 0.86, screen: [0.5, 0.45] },
      maraCrew: { target: 'maraM', focus: [0.5, 0.2], zoom: 1.9, screen: [0.46, 0.38], portrait: { target: 'maraM', focus: [0.5, 0.2], zoom: 1.4, screen: [0.5, 0.34] } },
      eliCrew: { target: 'eliM', focus: [0.5, 0.25], zoom: 1.9, screen: [0.48, 0.4], portrait: { target: 'eliM', focus: [0.5, 0.25], zoom: 1.4, screen: [0.5, 0.38] } },
      pipCrew: { target: 'pipM', focus: [0.45, 0.3], zoom: 2.2, screen: [0.5, 0.42], portrait: { target: 'pipM', focus: [0.45, 0.3], zoom: 1.6, screen: [0.5, 0.4] } },
      pipCloser: { target: 'pipM', focus: [0.45, 0.28], zoom: 2.6, screen: [0.5, 0.42], portrait: { target: 'pipM', focus: [0.45, 0.28], zoom: 1.9, screen: [0.5, 0.4] } },
      maraEli: { target: ['maraM', 'eliM'], focus: [0.5, 0.3], fill: 0.9, screen: [0.5, 0.42] },
      toBase: { target: 'baseM', focus: [0.4, 0.5], zoom: 1.35, portrait: { target: 'baseM', focus: [0.4, 0.5], zoom: 1.05 } },
      apolloWide: { target: 'apolloScene', focus: [0.5, 0.5], zoom: 1, bounds: 'apolloScene' },
      apolloReveal: { target: 'apollo', focus: [0.6, 0.45], zoom: 1.12, screen: [0.5, 0.45], bounds: 'apolloScene' },
      apolloFocus: { target: 'apollo', fill: 0.62, screen: [0.5, 0.44], bounds: 'apolloScene' },
    },
  },

  // ---------------------------------------------------------------- 1969 flashback (B24–B25)
  archive: {
    id: 'archive', label: 'Apollo 11, July 1969 — historical flashback', tone: 'archive', costume: 'eva',
    layers: [
      { id: 'backdrop', fx: 'archiveBackdrop', depth: 0, box: full },
      { id: 'recon', asset: 'reconLander', label: 'Illustrated reconstruction of the lunar module Eagle at Tranquility Base',
        depth: 1, box: { x: 50, y: 58, w: 'min(78cqw, 118cqh)' }, portrait: { x: 50, y: 50, w: '150cqw' },
        children: [{ id: 'astronaut', asset: 'reconAstronaut', label: 'Illustrated reconstruction of the first step', depth: 1,
          box: { x: 56, y: 87, h: '24%', anchor: [0.5, 1] }, initial: { opacity: 0, xp: -73, yp: -83 } }] },
      { id: 'reconLabel', fx: 'label', props: { text: 'Illustrated reconstruction — not archival footage' }, depth: 0,
        box: { x: 50, y: 93, anchor: [0.5, 1] }, portrait: { y: 80 }, initial: { opacity: 0 } },
      { id: 'dateCard', fx: 'dateCard', props: { kicker: 'Documented history', year: '1969', title: 'Apollo 11' }, depth: 0,
        box: { x: 50, y: 12, anchor: [0.5, 0] }, portrait: { y: 14 }, initial: { opacity: 0 } },
      { id: 'grain', fx: 'filmGrain', depth: 0, box: full },
      vignette(0.9),
      // Last, so the documented-history panel sits above grain and vignette and stays fully legible.
      { id: 'archivePanel', fx: 'archivePanel', depth: 0, initial: { opacity: 0 },
        box: { x: 50, y: 47, w: 'min(94cqw, 1120px)', h: 'min(74cqh, 700px)' }, portrait: { y: 50, w: '94cqw', h: '72cqh' } },
    ],
    shots: {
      wide: {},
      firstStep: { target: 'recon', focus: [0.52, 0.66], zoom: 1.45, screen: [0.5, 0.52], portrait: { target: 'recon', focus: [0.52, 0.7], zoom: 1.3, screen: [0.5, 0.5] } },
    },
  },

  // ---------------------------------------------------------------- Ending card (B33)
  ending: {
    id: 'ending', label: 'Chapter one complete', tone: 'black', costume: 'flight',
    layers: [
      { ...stars(0.02), initial: { opacity: 0.35 } },
      { id: 'mars', fx: 'marsGlint', depth: 0.02, box: { x: 78, y: 26, w: '2.6cqmin', h: '2.6cqmin' }, portrait: { x: 74, y: 16 } },
      { id: 'endCard', fx: 'endCard', depth: 0, box: { x: 50, y: 50 } },
    ],
    shots: { wide: {} },
  },
};
