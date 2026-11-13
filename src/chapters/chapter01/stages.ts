import type { LayerDef, StageDef, StageId } from '../../story/types';

// Composition manifest for Chapter 01: six reusable illustrated stages.
//
// Each stage is built once from layers (artwork, characters, effects) and reused across many beats.
// Beats only change layer states and camera framing, so a single cockpit illustration provides the wide
// shot, the crew introductions, every close-up and the push toward the window.
//
// Boxes use container units (cqw/cqh/cqmin) so the composition scales with the viewport. `portrait`
// boxes recompose for phones held upright instead of shrinking the desktop frame. `depth` drives
// parallax: 0 is fixed to the screen, 1 moves with the camera.

const full = { x: 50, y: 50, w: '100cqw', h: '100cqh' };

const stars = (depth: number, y = 50): LayerDef => ({
  id: 'stars', asset: 'spaceStars', depth, box: { x: 50, y, w: '134cqw', h: '134cqh' },
});

const vignette = (opacity = 0): LayerDef => ({
  id: 'vignette', fx: 'vignette', depth: 0, box: full, initial: { opacity },
});

const thruster: LayerDef = { id: 'asterThrust', fx: 'thruster', box: { x: 75, y: 37, w: '16%', h: '42%' } };

export const stages: Record<StageId, StageDef> = {
  // ---------------------------------------------------------------- Space (B01–B04, B14, B32)
  orbit: {
    id: 'orbit', label: 'Space between Earth and the Moon', tone: 'space', costume: 'flight',
    layers: [
      stars(0.05),
      { id: 'sun', fx: 'glow', props: { tone: 'sun' }, depth: 0.1, box: { x: 94, y: 6, w: '86cqmax', h: '86cqmax' }, initial: { opacity: 0.4 } },
      { id: 'mars', fx: 'marsGlint', depth: 0.06, box: { x: 15, y: 22, w: '3.2cqmin', h: '3.2cqmin' }, portrait: { x: 18, y: 14 }, initial: { opacity: 0 } },
      { id: 'earth', asset: 'earth', label: 'Earth', depth: 0.3,
        box: { x: 33, y: 50, w: 'min(68cqw, 92cqh)', aspect: 1 }, portrait: { x: 46, y: 34, w: 'min(150cqw, 66cqh)' } },
      { id: 'moon', asset: 'moonGlobe', label: 'The Moon', depth: 0.42, initial: { opacity: 0 },
        box: { x: 30, y: 50, w: 'min(62cqw, 88cqh)', aspect: 1 }, portrait: { x: 46, y: 40, w: 'min(136cqw, 66cqh)' } },
      { id: 'aster', asset: 'aster', label: 'Aster spacecraft', depth: 1, initial: { opacity: 0 },
        box: { x: 44, y: 58, w: 'min(48cqw, 86cqh)' }, portrait: { x: 50, y: 64, w: '94cqw' }, children: [thruster] },
      vignette(),
    ],
    shots: {
      wide: {},
      earthNear: { point: [36, 50], zoom: 1.16, portrait: { point: [46, 38], zoom: 1.12 } },
      earthDrift: { point: [44, 51], zoom: 1.06, portrait: { point: [52, 42], zoom: 1.05 } },
      distant: { point: [66, 42], zoom: 1.1, portrait: { point: [70, 44], zoom: 1.1 } },
      reveal: { point: [50, 55], zoom: 1.06, portrait: { point: [50, 58], zoom: 1.06 } },
      intoWindow: { target: 'aster', focus: [0.17, 0.6], zoom: 4.2, maxZoom: 4.4 },
      lunarApproach: { target: 'moon', focus: [0.5, 0.5], zoom: 1.08 },
      lunarSurface: { target: 'moon', focus: [0.44, 0.6], zoom: 1.75 },
      departNear: { point: [60, 58], zoom: 1.34, portrait: { point: [56, 54], zoom: 1.3 } },
    },
  },

  // ---------------------------------------------------------------- Aster flight deck (B05–B13)
  cockpit: {
    id: 'cockpit', label: 'Aster flight deck', tone: 'interior', costume: 'flight',
    layers: [
      stars(0.08, 30),
      { id: 'windowEarth', asset: 'earth', label: 'Earth through the window', depth: 0.3,
        box: { x: 62, y: 25, w: 'min(24cqw, 40cqh)', aspect: 1 }, portrait: { x: 64, y: 21, w: '50cqw' } },
      { id: 'windowMoon', asset: 'moonGlobe', label: 'The Moon through the window', depth: 0.3, initial: { opacity: 0, scale: 0.5 },
        box: { x: 35, y: 22, w: 'min(8cqw, 13cqh)', aspect: 1 }, portrait: { x: 34, y: 18, w: '17cqw' } },
      { id: 'bridge', asset: 'cockpit', label: 'Aster flight deck', depth: 1, box: full, portrait: { w: '200cqw' } },
      { id: 'consoleGlow', fx: 'glow', props: { tone: 'amber' }, depth: 1, initial: { opacity: 0.55 },
        box: { x: 50, y: 76, w: '112cqw', h: '48cqh' } },
      { id: 'mara', character: 'mara', label: 'Captain Mara', depth: 1,
        box: { x: 30.5, y: 86, h: '46cqh', anchor: [0.5, 1] }, portrait: { x: 22, y: 74, h: '30cqh' } },
      { id: 'eli', character: 'eli', label: 'Engineer Eli', depth: 1,
        box: { x: 70, y: 86, h: '49cqh', anchor: [0.5, 1] }, portrait: { x: 77, y: 75, h: '31cqh' } },
      { id: 'pip', character: 'pip', label: 'Pip', depth: 1,
        box: { x: 50.5, y: 79, h: '26cqh', anchor: [0.5, 1] }, portrait: { x: 50, y: 73, h: '16cqh' },
        children: [{ id: 'pipDiag', fx: 'pipDiag', box: { x: 128, y: 34, w: '78%', h: '40%' }, initial: { opacity: 0 } }] },
      { id: 'tagMara', fx: 'nameTag', props: { name: 'Mara', role: 'Captain · reviewing the flight route' }, depth: 1,
        box: { x: 41, y: 50, anchor: [0, 0.5] }, portrait: { x: 22, y: 42, anchor: [0.5, 1] }, initial: { opacity: 0 } },
      { id: 'tagEli', fx: 'nameTag', props: { name: 'Eli', role: 'Engineer · looking at Earth' }, depth: 1,
        box: { x: 59, y: 48, anchor: [1, 0.5] }, portrait: { x: 77, y: 42, anchor: [0.5, 1] }, initial: { opacity: 0 } },
      { id: 'tagPip', fx: 'nameTag', props: { name: 'Pip', role: 'Checking the ship’s systems' }, depth: 1,
        box: { x: 50.5, y: 50, anchor: [0.5, 1] }, portrait: { x: 50, y: 55, anchor: [0.5, 1] }, initial: { opacity: 0 } },
      { id: 'hud', fx: 'hud', props: { system: 'Aster flight computer', title: 'Approaching the Moon' }, depth: 0,
        box: { x: 50, y: 15, anchor: [0.5, 0] }, initial: { opacity: 0 } },
      vignette(),
    ],
    shots: {
      wide: {},
      establishing: { point: [50, 54], zoom: 1.06 },
      windowIn: { point: [48, 24], zoom: 2.1, portrait: { point: [46, 22], zoom: 2 } },
      moonWindow: { target: 'windowMoon', zoom: 2.2, screen: [0.5, 0.42], portrait: { target: 'windowMoon', zoom: 2, screen: [0.5, 0.4] } },
      maraIntro: { target: 'mara', focus: [0.55, 0.4], zoom: 1.6, screen: [0.4, 0.5], portrait: { target: 'mara', focus: [0.55, 0.4], zoom: 1.55, screen: [0.5, 0.48] } },
      eliIntro: { target: 'eli', focus: [0.45, 0.4], zoom: 1.6, screen: [0.6, 0.5], portrait: { target: 'eli', focus: [0.45, 0.4], zoom: 1.55, screen: [0.5, 0.48] } },
      pipIntro: { target: 'pip', focus: [0.62, 0.42], zoom: 2, screen: [0.46, 0.5], portrait: { target: 'pip', focus: [0.6, 0.4], zoom: 1.9, screen: [0.46, 0.48] } },
      eliClose: { target: 'eli', focus: [0.45, 0.3], zoom: 2.05, screen: [0.56, 0.4], portrait: { target: 'eli', focus: [0.45, 0.3], zoom: 1.85, screen: [0.5, 0.38] } },
      eliCloser: { target: 'eli', focus: [0.47, 0.27], zoom: 2.3, screen: [0.55, 0.38], portrait: { target: 'eli', focus: [0.47, 0.27], zoom: 2.05, screen: [0.5, 0.36] } },
      maraMid: { target: 'mara', focus: [0.6, 0.32], zoom: 1.8, screen: [0.42, 0.42], portrait: { target: 'mara', focus: [0.6, 0.32], zoom: 1.75, screen: [0.5, 0.38] } },
      pipClose: { target: 'pip', focus: [0.55, 0.3], zoom: 2.45, screen: [0.48, 0.4], portrait: { target: 'pip', focus: [0.55, 0.3], zoom: 2.3, screen: [0.5, 0.38] } },
      pipMara: { target: ['mara', 'pip'], focus: [0.5, 0.36], fill: 0.95, screen: [0.48, 0.44] },
      maraSmile: { target: 'mara', focus: [0.64, 0.3], zoom: 2, screen: [0.45, 0.42], portrait: { target: 'mara', focus: [0.62, 0.3], zoom: 1.9, screen: [0.5, 0.4] } },
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
        box: { x: 63, y: 68, w: 'min(30cqw, 54cqh)', anchor: [0.5, 0.8] }, portrait: { x: 58, y: 64, w: '68cqw' },
        children: [thruster, { id: 'landingGlow', fx: 'landingGlow', box: { x: 46, y: 86, w: '56%', h: '46%' }, initial: { opacity: 0 } }] },
      { id: 'dust', fx: 'dust', depth: 1, box: { x: 63, y: 69, w: '34cqw', h: '8cqh' }, portrait: { x: 58, y: 65, w: '80cqw' }, initial: { opacity: 0 } },
      { id: 'refuelLine', fx: 'refuelLine', depth: 1, box: { x: 74, y: 58.5, w: '3cqmin', h: '3cqmin' }, portrait: { x: 77, y: 56 }, initial: { opacity: 0 } },
      { id: 'refuelStatus', fx: 'statusTag', props: { label: 'Refueling' }, depth: 1,
        box: { x: 80, y: 43.5, anchor: [1, 1] }, portrait: { x: 88, y: 45 }, initial: { opacity: 0, vars: { progress: 0 } } },
      vignette(),
    ],
    shots: {
      wide: {},
      descentHigh: { point: [66, 28], zoom: 1.32, portrait: { point: [60, 30], zoom: 1.2 } },
      descentTrack: { point: [60, 52], zoom: 1.14, portrait: { point: [58, 52], zoom: 1.12 } },
      landed: { point: [56, 58], zoom: 1.08, portrait: { point: [56, 56], zoom: 1.08 } },
      refuel: { target: ['aster', 'gantry'], focus: [0.5, 0.45], fill: 0.92 },
      liftoffNear: { point: [62, 58], zoom: 1.2, portrait: { point: [58, 56], zoom: 1.16 } },
      liftoffSky: { point: [58, 32], zoom: 1.12, portrait: { point: [56, 32], zoom: 1.1 } },
    },
  },

  // ---------------------------------------------------------------- Tranquility Base, today (B17–B23, B26–B30)
  apolloSite: {
    id: 'apolloSite', label: 'The Apollo 11 landing site on the Moon', tone: 'moon', costume: 'eva',
    layers: [
      stars(0.04, 34),
      { id: 'skyEarth', asset: 'earth', label: 'Earth above the lunar horizon', depth: 0.12,
        box: { x: 76, y: 16, w: 'min(10cqw, 17cqh)', aspect: 1 }, portrait: { x: 70, y: 12, w: '22cqw' } },
      { id: 'farBase', asset: 'lunarBase', label: 'The lunar base on the horizon', depth: 0.5, initial: { opacity: 0.75 },
        box: { x: 14, y: 49.5, w: '20cqw', anchor: [0.5, 0.94] }, portrait: { x: 12, y: 47, w: '46cqw' } },
      { id: 'ground', asset: 'moonSurface', label: 'Lunar surface', depth: 1,
        box: { x: 50, y: 100, w: '108cqw', h: '62cqh', anchor: [0.5, 1] }, portrait: { w: '240cqw', h: '56cqh' } },
      { id: 'apolloGlow', fx: 'glow', props: { tone: 'cool' }, depth: 1, initial: { opacity: 0.2 },
        box: { x: 72, y: 57, w: '38cqw', h: '26cqh' }, portrait: { x: 64, y: 54, w: '90cqw' } },
      { id: 'perimeter', fx: 'perimeter', depth: 1, box: { x: 72, y: 63.5, w: '40cqw', h: '9cqw' }, portrait: { x: 64, y: 58.5, w: '92cqw', h: '20cqw' } },
      { id: 'apollo', asset: 'apolloDescent', label: 'Apollo 11 descent stage', depth: 1,
        box: { x: 72, y: 64, w: 'min(22cqw, 40cqh)', anchor: [0.5, 0.86] }, portrait: { x: 64, y: 59, w: '54cqw' },
        children: [
          { id: 'apolloReticle', fx: 'reticle', props: { label: 'Scan · no contact' }, box: { x: 50, y: 46, w: '128%', h: '136%' }, initial: { opacity: 0 } },
          { id: 'apolloHotspot', fx: 'hotspot', props: { label: 'Apollo 11 landing site', hint: 'Look back to 1969' },
            box: { x: 50, y: 46, w: '64%', h: '86%' }, initial: { opacity: 0 } },
        ] },
      // Feet stand above the bottom band of ground, which stays free for the dialogue box.
      { id: 'mara', character: 'mara', label: 'Mara in her EVA suit', depth: 1,
        box: { x: 22, y: 84, h: '40cqh', anchor: [0.5, 1] }, portrait: { x: 19, y: 78, h: '28cqh' } },
      { id: 'eli', character: 'eli', label: 'Eli in his EVA suit', depth: 1,
        box: { x: 35, y: 86, h: '42cqh', anchor: [0.5, 1] }, portrait: { x: 48, y: 80, h: '29cqh' } },
      { id: 'pip', character: 'pip', label: 'Pip with lunar equipment', depth: 1,
        box: { x: 46.5, y: 84, h: '20cqh', anchor: [0.5, 1] }, portrait: { x: 79, y: 78, h: '14cqh' },
        children: [{ id: 'scanWave', fx: 'scanWave', box: { x: 132, y: 30, w: '170%', h: '64%' }, initial: { opacity: 0 } }] },
      vignette(),
    ],
    shots: {
      wide: {},
      walkStart: { point: [16, 64], zoom: 1.45, portrait: { point: [30, 66], zoom: 1.3 } },
      walkEnd: { point: [30, 64], zoom: 1.45, portrait: { point: [44, 66], zoom: 1.3 } },
      discovery: { point: [52, 54], zoom: 1.04, portrait: { point: [50, 60], zoom: 1.04 } },
      maraLooks: { target: ['mara', 'apollo'], focus: [0.5, 0.42], fill: 0.98, screen: [0.5, 0.44] },
      eliMid: { target: 'eli', focus: [0.6, 0.2], zoom: 1.9, screen: [0.44, 0.4], portrait: { target: 'eli', focus: [0.6, 0.2], zoom: 1.8, screen: [0.5, 0.38] } },
      pipScan: { target: ['pip', 'apollo'], focus: [0.5, 0.48], fill: 0.72, screen: [0.5, 0.38] },
      eliClose: { target: 'eli', focus: [0.62, 0.18], zoom: 2.3, screen: [0.46, 0.38], portrait: { target: 'eli', focus: [0.62, 0.18], zoom: 2.1, screen: [0.5, 0.36] } },
      pipClose: { target: 'pip', focus: [0.55, 0.3], zoom: 2.8, maxZoom: 3, screen: [0.5, 0.4], portrait: { target: 'pip', focus: [0.5, 0.3], zoom: 2.6, maxZoom: 3, screen: [0.5, 0.38] } },
      crewMid: { target: ['mara', 'eli', 'pip'], focus: [0.5, 0.36], fill: 0.92, screen: [0.5, 0.44] },
      apolloFocus: { target: 'apollo', focus: [0.5, 0.5], fill: 0.52, screen: [0.5, 0.42] },
      crewBehind: { point: [48, 56], zoom: 1.16, portrait: { point: [52, 60], zoom: 1.1 } },
      maraEli: { target: ['mara', 'eli'], focus: [0.5, 0.26], fill: 0.86, screen: [0.5, 0.42] },
      pipEli: { target: ['eli', 'pip'], focus: [0.5, 0.32], fill: 0.86, screen: [0.5, 0.42] },
      leaving: { point: [42, 54], zoom: 1.02 },
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
