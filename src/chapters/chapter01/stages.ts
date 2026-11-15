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
    id: 'orbit', label: 'Space between Earth and the Moon', tone: 'space', costume: 'flight', music: 'space',
    layers: [
      stars(0.05),
      { id: 'sun', fx: 'glow', props: { tone: 'sun' }, depth: 0.1, box: { x: 94, y: 6, w: '86cqmax', h: '86cqmax' }, initial: { opacity: 0.4 } },
      { id: 'mars', fx: 'marsGlint', depth: 0.06, box: { x: 86, y: 20, w: '3.2cqmin', h: '3.2cqmin' }, portrait: { x: 82, y: 14 }, initial: { opacity: 0 } },
      { id: 'earth', asset: 'earth', label: 'Earth', depth: 0.3,
        box: { x: 67, y: 50, w: 'min(68cqw, 92cqh)', aspect: 1 }, portrait: { x: 54, y: 34, w: 'min(150cqw, 66cqh)' } },
      { id: 'moon', asset: 'moonGlobe', label: 'The Moon', depth: 0.42, initial: { opacity: 0 },
        box: { x: 30, y: 50, w: 'min(62cqw, 88cqh)', aspect: 1 }, portrait: { x: 46, y: 40, w: 'min(136cqw, 66cqh)' } },
      // Artists' painting of deep space and the limb of Earth: the opening view (B01–B03). Slightly oversized
      // and far back, so the slow camera move reads as parallax against Aster. Hidden for lunar orbit (B14)
      // and the departure (B32), where the small Earth and the Moon above are used instead.
      { id: 'earthLimb', asset: 'spaceEarthLimb', label: 'Earth from orbit', depth: 0.3, box: cover(2000 / 1126, 1.12) },
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
    id: 'cockpit', label: 'Aster flight deck', tone: 'interior', costume: 'flight', bounds: 'wide', music: 'interior',
    layers: [
      // Wide painting with Eli's open-mouth frame, so he can speak in the wide shot too (B11).
      { id: 'wide', fx: 'talkingPainting', props: { base: 'cockpitWide', eli: 'cockpitWideEli' },
        label: 'Aster flight deck: Mara at navigation, Eli by the window', depth: 1,
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
      // Bridge group shot: Mara standing beside Eli with Pip to the right, Earth in the window (B11).
      { id: 'bridge', asset: 'bridgeCrew', label: 'Aster bridge: Mara and Eli side by side, Pip to the right', depth: 1,
        initial: { opacity: 0 }, box: cover(16 / 9),
        children: [marker('maraB', 29, 32, 12, 24), marker('eliB', 46, 30, 12, 24), marker('pipB', 69, 40, 10, 20)] },
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
      eliWide: { target: 'eliMark', focus: [0.5, 0.2], zoom: 2.1, screen: [0.56, 0.4], portrait: { target: 'eliMark', focus: [0.5, 0.2], zoom: 1.7, screen: [0.5, 0.36] } },
      pipIntro: { target: 'pip', focus: [0.62, 0.42], zoom: 2.1, screen: [0.46, 0.5] },
      pipClose: { target: 'pip', focus: [0.55, 0.3], zoom: 2.6, screen: [0.48, 0.4] },
      pipMara: { target: ['maraMark', 'pip'], focus: [0.5, 0.42], fill: 0.9, screen: [0.5, 0.44] },
      moonWindow: { target: 'windowMoon', zoom: 2.3, screen: [0.5, 0.42] },
      twoBoth: { target: ['twoEli', 'twoMara'], focus: [0.5, 0.5], zoom: 1.35, screen: [0.42, 0.42], portrait: { target: ['twoEli', 'twoMara'], zoom: 1.2, screen: [0.5, 0.42] } },
      twoEli: { target: 'twoEli', zoom: 1.9, screen: [0.44, 0.38], portrait: { target: 'twoEli', zoom: 1.6, screen: [0.5, 0.36] } },
      twoEliClose: { target: 'twoEli', zoom: 2.2, screen: [0.46, 0.38], portrait: { target: 'twoEli', zoom: 1.8, screen: [0.5, 0.36] } },
      twoMara: { target: 'twoMara', zoom: 1.9, screen: [0.44, 0.42], portrait: { target: 'twoMara', zoom: 1.6, screen: [0.5, 0.4] } },
      // All three faces kept in the upper two-thirds, clear of the dialogue box; bounded to the painting.
      bridgeGroup: { target: ['maraB', 'pipB'], focus: [0.5, 0.3], fill: 0.92, screen: [0.5, 0.36], bounds: 'bridge',
        portrait: { target: ['maraB', 'pipB'], focus: [0.5, 0.3], fill: 1, screen: [0.5, 0.32], bounds: 'bridge' } },
    },
  },

  // ---------------------------------------------------------------- Aster galley (B13A)
  // The artists' galley painting: Eli finally at the coffee machine, Mara with her tablet, the Moon filling
  // the window. `glance` is the same frame with Mara looking over at Eli; fading it in and out is her glance.
  galley: {
    id: 'galley', label: 'Aster galley, with the Moon in the window', tone: 'interior', costume: 'flight', bounds: 'room', music: 'interior',
    layers: [
      { id: 'room', fx: 'talkingPainting', props: { base: 'galley', eli: 'galleyEli', mara: 'galleyMara' },
        label: 'Eli at the coffee machine and Mara with a tablet; the Moon fills the window', depth: 1, box: cover(2000 / 1126),
        children: [marker('eliG', 28.5, 42, 14, 50), marker('maraG', 47, 50, 10, 46), marker('moonG', 85, 36, 28, 44)] },
      { id: 'glance', asset: 'galleyGlance', depth: 1, initial: { opacity: 0 }, box: cover(2000 / 1126) },
      vignette(0.25),
    ],
    shots: {
      wide: {},
      coffee: { target: ['eliG', 'maraG'], focus: [0.4, 0.3], zoom: 1.55, screen: [0.46, 0.44], portrait: { target: 'eliG', focus: [0.6, 0.3], zoom: 1.25, screen: [0.5, 0.4] } },
      moonView: { target: 'moonG', focus: [0.3, 0.5], zoom: 1.28, screen: [0.6, 0.46], portrait: { target: 'moonG', focus: [0.4, 0.5], zoom: 1.15, screen: [0.5, 0.4] } },
    },
  },

  // ---------------------------------------------------------------- Fictional lunar refuelling station (B15, B16, B31)
  // One painted plate (terrain, domes, landing pad, parked gantry, Earth in sky). Aster, its contact shadow and
  // the refuelling status are children of the plate, so they share its crop/scale on every viewport. The pad
  // centre in the painting is ~(51%, 79%); Aster lands there.
  lunarBase: {
    id: 'lunarBase', label: 'A fictional future lunar base and refuelling pad', tone: 'moon', costume: 'flight', music: 'moon',
    bounds: 'plate',
    layers: [
      { id: 'plate', asset: 'lunarPad', label: 'Lunar refuelling facility: terrain, domes, landing pad and parked gantry', depth: 1,
        box: cover(16 / 9),
        children: [
          marker('padMark', 51, 79, 40, 10),
          { id: 'baseGlow', fx: 'glow', props: { tone: 'amber' }, box: { x: 18, y: 62, w: '30%', h: '18%' }, initial: { opacity: 0.35 } },
          { id: 'asterShadow', fx: 'shadow', box: { x: 51, y: 81, w: '34%', h: '7%' }, initial: { opacity: 0 } },
          { id: 'aster', asset: 'aster', label: 'Aster', box: { x: 51, y: 80, w: '30%', anchor: [0.5, 0.92] },
            children: [thruster, { id: 'landingGlow', fx: 'landingGlow', box: { x: 50, y: 100, w: '50%', h: '50%' }, initial: { opacity: 0 } }] },
          { id: 'dust', fx: 'dust', box: { x: 51, y: 79, w: '42%', h: '9%' }, initial: { opacity: 0 } },
          { id: 'refuelLine', fx: 'refuelLine', box: { x: 80, y: 56, w: '4%', h: '4%' }, initial: { opacity: 0 } },
          { id: 'refuelStatus', fx: 'statusTag', props: { label: 'Refueling' }, box: { x: 88, y: 42, anchor: [1, 1] }, initial: { opacity: 0, vars: { progress: 0 } } },
        ] },
      vignette(),
    ],
    shots: {
      wide: {},
      descentHigh: { point: [52, 28], zoom: 1.32, portrait: { point: [50, 30], zoom: 1.2 } },
      descentTrack: { point: [54, 52], zoom: 1.14, portrait: { point: [52, 52], zoom: 1.12 } },
      landed: { point: [51, 62], zoom: 1.08, portrait: { point: [51, 60], zoom: 1.08 } },
      refuel: { target: ['aster', 'padMark'], focus: [0.5, 0.4], fill: 0.9 },
      liftoffNear: { point: [51, 58], zoom: 1.2, portrait: { point: [51, 56], zoom: 1.16 } },
      liftoffSky: { point: [54, 32], zoom: 1.12, portrait: { point: [52, 32], zoom: 1.1 } },
    },
  },

  // ---------------------------------------------------------------- The Moon, today (B17–B23, B26–B30)
  // Two paintings: `crewScene` (Mara, Eli and Pip in EVA gear by the base) and `apolloScene` (the Apollo 11
  // descent stage). Lines alternate between them: the crew when they speak, the lander when it is the subject.
  apolloSite: {
    id: 'apolloSite', label: 'The Apollo 11 landing site on the Moon', tone: 'moon', costume: 'eva', bounds: 'crewScene', music: 'moon',
    layers: [
      // The finished lunar crew panel (16:9): Mara standing (left), Eli kneeling (centre), Pip, Apollo site right.
      { id: 'crewScene', asset: 'moonCrewPainting', label: 'Mara, Eli and Pip on the lunar surface near the Apollo 11 site', depth: 1,
        box: cover(16 / 9),
        children: [
          marker('maraM', 14, 30, 16, 50),
          marker('eliM', 32, 43, 18, 44),
          marker('pipM', 52, 50, 14, 36),
          marker('baseM', 80, 46, 22, 24),
          { id: 'pipThinking', fx: 'pipStatus', props: { mode: 'thinking' }, box: { x: 60, y: 44, anchor: [0, 0.5] }, initial: { opacity: 0 } },
          { id: 'pipSaved', fx: 'pipStatus', props: { mode: 'saved', text: 'Saved to memory' }, box: { x: 60, y: 44, anchor: [0, 0.5] }, initial: { opacity: 0 } },
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
    id: 'archive', label: 'Apollo 11, July 1969 — historical flashback', tone: 'archive', costume: 'eva', music: 'archive',
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
    id: 'ending', label: 'Chapter one complete', tone: 'black', costume: 'flight', music: 'space',
    layers: [
      { ...stars(0.02), initial: { opacity: 0.85 } },
      { id: 'mars', fx: 'marsGlint', depth: 0.02, box: { x: 78, y: 26, w: '2.6cqmin', h: '2.6cqmin' }, portrait: { x: 74, y: 16 } },
      { id: 'endCard', fx: 'endCard', depth: 0, box: { x: 50, y: 50 } },
    ],
    shots: { wide: {} },
  },
};
