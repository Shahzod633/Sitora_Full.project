// Central asset manifest for all three chapters.
//
// Every illustration has a bundled TEMPORARY fallback (src/assets/chapter0N/*.svg) and an optional `src`
// for the artists' final file in public/. Drop the delivered file into public/, set `src` (and `mobileSrc`
// for an optional portrait crop), change `status` to 'final', and the story swaps it in once it decodes.
// Source images are never modified: framing is done by the camera and layer boxes in
// chapters/chapter0N/stages.ts. See docs/ART_INTEGRATION_GUIDE.md.
import space from '../assets/chapter01/space.svg';
import earth from '../assets/chapter01/earth.svg';
import bridge from '../assets/chapter01/bridge.svg';
import moonSurface from '../assets/chapter01/moon.svg';
import moonGlobe from '../assets/chapter01/moon-globe.svg';
import facility from '../assets/chapter01/facility.svg';
import gantry from '../assets/chapter01/refuel-gantry.svg';
import apollo from '../assets/chapter01/apollo.svg';
import aster from '../assets/chapter01/aster.svg';
import mara from '../assets/chapter01/mara.svg';
import maraSmile from '../assets/chapter01/mara-smile.svg';
import maraEva from '../assets/chapter01/mara-eva.svg';
import eli from '../assets/chapter01/eli.svg';
import eliEva from '../assets/chapter01/eli-eva.svg';
import pip from '../assets/chapter01/pip.svg';
import pipFull from '../assets/chapter01/pip-full.svg';
import pipLunar from '../assets/chapter01/pip-lunar.svg';
import reconLander from '../assets/chapter01/recon-lander.svg';
import reconAstronaut from '../assets/chapter01/recon-astronaut.svg';
import marsGlobe from '../assets/chapter02/mars-globe.svg';
import marsLandscape from '../assets/chapter02/mars-landscape.svg';
import marsDescent from '../assets/chapter02/mars-descent.svg';
import marsDigSite from '../assets/chapter02/mars-digsite.svg';
import sojourner from '../assets/chapter02/sojourner.svg';
import pathfinderLander from '../assets/chapter02/pathfinder-lander.svg';
import roverTop from '../assets/chapter02/rover-top.svg';
import rock from '../assets/chapter02/rock.svg';
import rockTarget from '../assets/chapter02/rock-target.svg';
import groundTop from '../assets/chapter02/ground-top.svg';
import roverMer from '../assets/chapter03/rover-mer.svg';
import roverMsl from '../assets/chapter03/rover-msl.svg';
import maraKneel from '../assets/chapter03/mara-kneel.svg';
import maraSalute from '../assets/chapter03/mara-salute.svg';
import pipCarry from '../assets/chapter03/pip-carry.svg';
import marsSunset from '../assets/chapter03/mars-sunset.svg';

export type AssetKind = 'background' | 'object' | 'character' | 'reconstruction';
/** temporary: bundled placeholder (or a stand-in reused from another scene). final: the artists' artwork. */
export type AssetStatus = 'temporary' | 'final';

export type AssetDef = {
  kind: AssetKind;
  /** Bundled temporary illustration, painted until `src` has decoded (or if it fails). */
  fallback: string;
  /** Final artwork, relative to public/ (e.g. 'assets/backgrounds/cockpit.webp'). */
  src?: string;
  /** Optional portrait crop of the final artwork, used when the viewport is taller than wide. */
  mobileSrc?: string;
  /** Intrinsic width / height. Layer boxes use it so camera framing follows the drawing itself. */
  aspect: number;
  /** How the image fills its layer box. Default: contain. */
  fit?: 'contain' | 'cover' | 'stretch';
  status: AssetStatus;
  /** What the art team needs to deliver for this slot. */
  brief: string;
};

const asset = (def: AssetDef) => def;

export const assets = {
  spaceStars: asset({ kind: 'background', fallback: space, aspect: 16 / 9, fit: 'cover', status: 'temporary',
    brief: 'Deep starfield, dark navy to muted blue, soft white stars. Tileable or oversized (bleed for parallax).' }),
  earth: asset({ kind: 'object', fallback: earth, aspect: 1, status: 'temporary',
    brief: 'Earth from orbit on transparency, hand-drawn, soft cyan halo. Reused at many scales (B01, cockpit window, lunar sky).' }),
  moonGlobe: asset({ kind: 'object', fallback: moonGlobe, aspect: 1, status: 'temporary',
    brief: 'MISSING ART: the Moon from space on transparency (B13 window, B14 lunar orbit, B32 departure).' }),
  cockpit: asset({ kind: 'background', fallback: bridge, aspect: 1400 / 680, fit: 'stretch', status: 'temporary',
    brief: 'Aster flight deck with transparent windows (space shows through). Wide enough to crop on Mara, Eli, Pip and the window.' }),
  moonSurface: asset({ kind: 'background', fallback: moonSurface, aspect: 1400 / 550, fit: 'stretch', status: 'temporary',
    brief: 'Lunar ground strip with horizon ridge on transparency; desaturated grey-blue.' }),
  lunarBase: asset({ kind: 'object', fallback: facility, aspect: 4.5, status: 'temporary',
    brief: 'Fictional lunar facility skyline (future technology, no NASA branding).' }),
  refuelGantry: asset({ kind: 'object', fallback: gantry, aspect: 160 / 220, status: 'temporary',
    brief: 'MISSING ART: refuelling gantry/arm that connects to Aster on the pad (B16).' }),
  aster: asset({ kind: 'object', fallback: aster, src: 'assets/art/aster.webp', aspect: 1810 / 869, status: 'final',
    brief: 'Aster exterior on transparency (artist art, nose right). Still needed: landing/landed pose for B15, B16, B31.' }),

  // ---- Artist paintings (full scenes; layer boxes keep their exact aspect so markers stay aligned) ----
  asterSpace: asset({ kind: 'background', fallback: space, src: 'assets/art/aster-space.webp', aspect: 1672 / 941, status: 'final',
    brief: 'Aster in space with Earth (hero frame for B03–B04).' }),
  cockpitWide: asset({ kind: 'background', fallback: bridge, src: 'assets/art/cockpit-wide.jpg', aspect: 2000 / 1125, fit: 'stretch', status: 'final',
    brief: 'Cockpit wide shot: Mara seated at navigation, Eli standing, Earth in the window. Pip not painted yet.' }),
  cockpitTwoShot: asset({ kind: 'background', fallback: bridge, src: 'assets/art/cockpit-twoshot-closed.jpg', aspect: 2000 / 1125, fit: 'stretch', status: 'final',
    brief: 'Cockpit two-shot, both mouths closed (base frame for lip-sync).' }),
  cockpitTwoShotMara: asset({ kind: 'background', fallback: bridge, src: 'assets/art/cockpit-twoshot-mara.jpg', aspect: 2000 / 1125, fit: 'stretch', status: 'final',
    brief: 'Same two-shot, Mara mouth open (talking frame).' }),
  cockpitTwoShotEli: asset({ kind: 'background', fallback: bridge, src: 'assets/art/cockpit-twoshot-eli.jpg', aspect: 2000 / 1125, fit: 'stretch', status: 'final',
    brief: 'Same two-shot, Eli mouth open (talking frame).' }),
  apolloPainting: asset({ kind: 'background', fallback: moonSurface, src: 'assets/art/apollo-site.jpg', aspect: 1672 / 941, fit: 'stretch', status: 'final',
    brief: 'Apollo 11 descent stage on the lunar surface with Earth.' }),
  // moon-crew-aster.webp is a copy of moon-crew.webp with the NASA insignia covered by painted ASTER patches
  // (NASA Space Apps rules). Temporary until the artist repaints the suits; the original file is unchanged.
  moonCrewPainting: asset({ kind: 'background', fallback: moonSurface, src: 'assets/art/moon-crew-aster.webp', aspect: 1721 / 914, fit: 'stretch', status: 'final',
    brief: 'Mara, Eli and Pip in EVA gear near the lunar base. Needs the suits repainted with the ASTER mark (NASA insignia are covered by a temporary patch) and a clean export without the window-control icons.' }),
  apolloDescent: asset({ kind: 'object', fallback: apollo, aspect: 490 / 290, status: 'temporary',
    brief: 'Apollo 11 descent stage as it stands today (ascent stage gone). Historically accurate silhouette.' }),
  mara: asset({ kind: 'character', fallback: mara, aspect: 190 / 255, status: 'temporary',
    brief: 'Captain Mara, flight clothing, upper body at the navigation console.' }),
  maraSmile: asset({ kind: 'character', fallback: maraSmile, aspect: 190 / 255, status: 'temporary',
    brief: 'MISSING ART: Mara smiling (same pose as mara). Needed for B12 "Mara smiles".' }),
  maraEva: asset({ kind: 'character', fallback: maraEva, aspect: 200 / 340, status: 'temporary',
    brief: 'MISSING ART: Mara in a sealed pressurised EVA suit, full body, standing.' }),
  eli: asset({ kind: 'character', fallback: eli, aspect: 180 / 260, status: 'temporary',
    brief: 'Engineer Eli, flight clothing, upper body at the window.' }),
  eliEva: asset({ kind: 'character', fallback: eliEva, aspect: 200 / 350, status: 'temporary',
    brief: 'MISSING ART: Eli in a sealed pressurised EVA suit, full body, standing.' }),
  pip: asset({ kind: 'character', fallback: pip, aspect: 150 / 190, status: 'temporary',
    brief: 'Original Pip bust (kept for reference; the story uses pipFull).' }),
  pipFull: asset({ kind: 'character', fallback: pipFull, aspect: 150 / 236, status: 'temporary',
    brief: 'MISSING ART: Pip full body: digital face screen, mechanical arms, hands, short legs, magnetic feet.' }),
  pipLunar: asset({ kind: 'character', fallback: pipLunar, aspect: 150 / 236, status: 'temporary',
    brief: 'MISSING ART: Pip with lunar-operation kit (lamp, power pack), same silhouette as pipFull.' }),
  reconLander: asset({ kind: 'reconstruction', fallback: reconLander, aspect: 640 / 400, status: 'temporary',
    brief: 'MISSING ART: illustrated reconstruction of Eagle on the surface, 1969 (archival tones, clearly not a photo).' }),
  reconAstronaut: asset({ kind: 'reconstruction', fallback: reconAstronaut, aspect: 60 / 110, status: 'temporary',
    brief: 'MISSING ART: illustrated 1969 astronaut figure for the first-step reconstruction (separate layer).' }),

  // ---- Artist paintings added from the team's artwork folder (copied, originals untouched) ----
  spaceEarthLimb: asset({ kind: 'background', fallback: space, src: 'assets/art/space-earth-limb.jpg', aspect: 2000 / 1126, fit: 'stretch', status: 'final',
    brief: 'Deep space with the limb of Earth (title screen and Chapter 1 opening, B01-B03).' }),
  cockpitWideEli: asset({ kind: 'background', fallback: bridge, src: 'assets/art/cockpit-wide-eli.jpg', aspect: 2000 / 1125, fit: 'stretch', status: 'final',
    brief: 'Cockpit wide shot, Eli mouth open (talking frame for cockpitWide).' }),
  galley: asset({ kind: 'background', fallback: bridge, src: 'assets/art/galley-idle.jpg', aspect: 2000 / 1126, fit: 'stretch', status: 'final',
    brief: 'Aster galley: Eli at the coffee machine, Mara with a tablet, the Moon in the window. Both mouths closed, Mara reading.' }),
  galleyGlance: asset({ kind: 'background', fallback: bridge, src: 'assets/art/galley-glance.jpg', aspect: 2000 / 1126, fit: 'stretch', status: 'final',
    brief: 'Same galley frame, Mara glancing toward Eli (eyes variant).' }),
  galleyEli: asset({ kind: 'background', fallback: bridge, src: 'assets/art/galley-eli.jpg', aspect: 2000 / 1126, fit: 'stretch', status: 'final',
    brief: 'Same galley frame, Eli mouth open (talking frame).' }),
  galleyMara: asset({ kind: 'background', fallback: bridge, src: 'assets/art/galley-mara.jpg', aspect: 2000 / 1126, fit: 'stretch', status: 'final',
    brief: 'Same galley frame, Mara mouth open (talking frame).' }),
  observationDeck: asset({ kind: 'background', fallback: bridge, src: 'assets/art/observation-closed.jpg', aspect: 2000 / 1126, fit: 'stretch', status: 'final',
    brief: 'Observation window: Eli and Mara from behind, Earth below, the Moon beyond. Both mouths closed (idle/listening frame).' }),
  observationDeckEli: asset({ kind: 'background', fallback: bridge, src: 'assets/art/observation-eli.jpg', aspect: 2000 / 1126, fit: 'stretch', status: 'final',
    brief: 'Same observation frame, Eli mouth open (talking frame).' }),
  observationDeckMara: asset({ kind: 'background', fallback: bridge, src: 'assets/art/observation-mara.jpg', aspect: 2000 / 1126, fit: 'stretch', status: 'final',
    brief: 'Same observation frame, Mara mouth open (talking frame).' }),
  maraSheet: asset({ kind: 'character', fallback: mara, src: 'assets/art/mara-turnaround.jpg', aspect: 2000 / 1500, fit: 'stretch', status: 'final',
    brief: 'Mara character turnaround (front, three-quarter, side, rear three-quarter, back) on black. Used for her dialogue portrait where the scene shows her from behind.' }),

  // ---- Chapter 02: Mars (temporary placeholders until the artists deliver) ----
  marsGlobe: asset({ kind: 'object', fallback: marsGlobe, src: 'assets/art/mars-globe.webp', aspect: 1, status: 'final',
    brief: 'Mars from orbit on transparency (approach and orbit shots).' }),
  marsDescentSky: asset({ kind: 'background', fallback: marsDescent, src: 'assets/art/mars-descent.webp', aspect: 16 / 9, fit: 'stretch', status: 'final',
    brief: 'Mars during atmospheric descent: curved horizon, thin dusty atmosphere, 16:9.' }),
  marsLandscape: asset({ kind: 'background', fallback: marsLandscape, src: 'assets/art/mars-landscape.webp', aspect: 16 / 9, fit: 'stretch', status: 'final',
    brief: 'Wide Martian plain for the landing and the walk: open right side for the ship, low hills, scattered rocks.' }),
  marsDigSite: asset({ kind: 'background', fallback: marsDigSite, src: 'assets/art/mars-digsite.webp', aspect: 16 / 9, fit: 'stretch', status: 'final',
    brief: 'Discovery site, medium shot: dusty plain, distant hills, open ground in the lower middle. No rover, no characters.' }),
  marsCloseUp: asset({ kind: 'background', fallback: marsDigSite, src: 'assets/art/mars-closeup.webp', aspect: 16 / 9, fit: 'stretch', status: 'final',
    brief: 'Close-up ground at the discovery site (camera low, dust and small stones). The rover is a separate layer in the middle.' }),
  asterMars: asset({ kind: 'object', fallback: aster, src: 'assets/art/aster-mars.webp', aspect: 1440 / 990, status: 'final',
    brief: 'Aster landed on Mars, landing gear down, ¾ view, transparent.' }),
  // Sojourner: the blank nameplate on its side is at x 33–60 %, y 51–65 % of this image (see marsSite.ts).
  sojourner: asset({ kind: 'object', fallback: sojourner, src: 'assets/art/sojourner.webp', aspect: 1170 / 980, status: 'final',
    brief: 'Sojourner rover, three-quarter view facing right, dust-worn and not operating, blank nameplate, transparent.' }),
  maraMars: asset({ kind: 'character', fallback: maraEva, src: 'assets/art/mara-mars.webp', aspect: 397 / 1405, status: 'final',
    brief: 'Mara in the sealed exploration suit, full body, standing, facing right, transparent.' }),
  eliMars: asset({ kind: 'character', fallback: eliEva, src: 'assets/art/eli-mars.webp', aspect: 423 / 1392, status: 'final',
    brief: 'Eli in the sealed exploration suit, full body, standing, facing left, transparent.' }),
  // Pip: the blank face screen is at x 46.6–94.2 %, y 21.1–39.1 % of this image (see characters.ts `face`).
  pipMars: asset({ kind: 'character', fallback: pipLunar, src: 'assets/art/pip-mars.webp', aspect: 504 / 1239, status: 'final',
    brief: 'Pip with backpack, full body, facing right, blank face screen, no helmet, transparent. Used in every chapter.' }),
  reconPathfinder: asset({ kind: 'reconstruction', fallback: pathfinderLander, src: 'assets/art/pathfinder-recon.webp', aspect: 1468 / 950, status: 'final',
    brief: 'Illustrated reconstruction of the Pathfinder lander (airbags, ramp, mast), archival tones, transparent.' }),
  gameGround: asset({ kind: 'background', fallback: groundTop, src: 'assets/art/game-ground.webp', aspect: 1440 / 840, fit: 'stretch', status: 'final',
    brief: 'Top-down Martian ground tile for the rover mini-game.' }),
  gameRover: asset({ kind: 'object', fallback: roverTop, src: 'assets/art/game-rover.webp', aspect: 1140 / 860, status: 'final',
    brief: 'Sojourner from above for the mini-game, front pointing right, transparent.' }),
  gameRock: asset({ kind: 'object', fallback: rock, src: 'assets/art/game-rock.webp', aspect: 900 / 555, status: 'final',
    brief: 'Smooth Martian rock, three-quarter view from above, transparent (obstacle in the mini-game).' }),
  gameRockTarget: asset({ kind: 'object', fallback: rockTarget, src: 'assets/art/game-target.webp', aspect: 1065 / 880, status: 'final',
    brief: 'Target rock "Barnacle Bill", rough knobbly surface, transparent.' }),

  // ---- Chapter 03: the legacy (temporary placeholders until the artists deliver) ----
  holoSojourner: asset({ kind: 'object', fallback: sojourner, src: 'assets/art/holo-sojourner.webp', aspect: 1029 / 834, status: 'final',
    brief: 'Sojourner, clean line drawing in profile facing right. Tinted blue by the hologram effect.' }),
  holoSpirit: asset({ kind: 'object', fallback: roverMer, src: 'assets/art/holo-spirit.webp', aspect: 1204 / 800, status: 'final',
    brief: 'Spirit (Mars Exploration Rover), clean line drawing in profile facing right.' }),
  holoOpportunity: asset({ kind: 'object', fallback: roverMer, src: 'assets/art/holo-opportunity.webp', aspect: 1307 / 741, status: 'final',
    brief: 'Opportunity, clean line drawing in profile facing right.' }),
  holoCuriosity: asset({ kind: 'object', fallback: roverMsl, src: 'assets/art/holo-curiosity.webp', aspect: 1279 / 868, status: 'final',
    brief: 'Curiosity, clean line drawing in profile facing right.' }),
  holoPerseverance: asset({ kind: 'object', fallback: roverMsl, src: 'assets/art/holo-perseverance.webp', aspect: 1309 / 796, status: 'final',
    brief: 'Perseverance, clean line drawing in profile facing right.' }),
  maraKneel: asset({ kind: 'character', fallback: maraKneel, src: 'assets/art/mara-kneel.webp', aspect: 662 / 887, status: 'final',
    brief: 'Mara kneeling on one knee, reaching forward to wipe the nameplate, sealed suit, facing right, transparent.' }),
  maraSalute: asset({ kind: 'character', fallback: maraSalute, src: 'assets/art/mara-salute.webp', aspect: 487 / 1405, status: 'final',
    brief: 'Mara standing at attention giving a military salute, sealed suit, facing right, transparent.' }),
  pipCarry: asset({ kind: 'character', fallback: pipCarry, aspect: 150 / 236, status: 'temporary',
    brief: 'MISSING ART: Pip holding both arms forward, hands open under the load (Sojourner is a separate layer), transparent.' }),
  marsSunset: asset({ kind: 'background', fallback: marsSunset, aspect: 16 / 9, fit: 'stretch', status: 'temporary',
    brief: 'MISSING ART: panoramic Martian plain at sunset (warm sky, cool blue glow around the Sun), 16:9 or wider. No characters, no ship.' }),
} as const;

export type AssetId = keyof typeof assets;

/** Archival photographs. Web-sized copies of the originals from the NASA Image and Video Library
 * (images.nasa.gov), saved under public/assets/nasa/. Set `available: false` to fall back to a placeholder. */
export type ArchivePhoto = {
  nasaId: string;
  file: string;
  caption: string;
  credit: string;
  source: string;
  available: boolean;
};

/** Mars Pathfinder / Sojourner photographs for the 1997 reconstruction (Chapter 2). */
export const pathfinderPhotos: ArchivePhoto[] = [
  {
    nasaId: 'PIA00634', file: 'assets/nasa/PIA00634.jpg', available: true,
    caption: "Sojourner's Alpha Proton X-ray Spectrometer studies the rock \u201cBarnacle Bill\u201d, its first rock analysis, begun on Sol 3.",
    credit: 'Image: NASA/JPL',
    source: 'https://www.jpl.nasa.gov/images/pia00634-sojourners-apxs-studies-barnacle-bill/',
  },
  {
    nasaId: 'PIA00638', file: 'assets/nasa/PIA00638.jpg', available: true,
    caption: 'Sojourner on the Martian surface near \u201cBarnacle Bill\u201d, seen by the Imager for Mars Pathfinder.',
    credit: 'Image: NASA/JPL',
    source: 'https://science.nasa.gov/photojournal/sojourner-near-barnacle-bill/',
  },
  {
    nasaId: 'PIA01466', file: 'assets/nasa/PIA01466.jpg', available: true,
    caption: 'Colour panorama from the Pathfinder lander: the petals, Sojourner\u2019s tracks and the distant Twin Peaks.',
    credit: 'Image: NASA/JPL',
    source: 'https://science.nasa.gov/photojournal/improved-mpf-360-degree-color-panorama/',
  },
];

/** One photograph per rover-timeline entry (Chapter 3), keyed by entry id. */
export const roverPhotos: Record<string, ArchivePhoto> = {
  sojourner: {
    nasaId: 'PIA00638', file: 'assets/nasa/PIA00638.jpg', available: true,
    caption: 'Sojourner near the rock \u201cBarnacle Bill\u201d, July 1997.',
    credit: 'Image: NASA/JPL',
    source: 'https://science.nasa.gov/photojournal/sojourner-near-barnacle-bill/',
  },
  mer: {
    nasaId: 'PIA18079', file: 'assets/nasa/PIA18079.jpg', available: true,
    caption: 'Self-portrait by Opportunity, March 2014, after wind had cleaned dust from its solar panels.',
    credit: 'Image: NASA/JPL-Caltech/Cornell Univ./Arizona State Univ.',
    source: 'https://photojournal.jpl.nasa.gov/catalog/PIA18079',
  },
  curiosity: {
    nasaId: 'PIA16239', file: 'assets/nasa/PIA16239.jpg', available: true,
    caption: 'Self-portrait by Curiosity at \u201cRocknest\u201d in Gale Crater, assembled from 55 arm-camera images.',
    credit: 'Image: NASA/JPL-Caltech/MSSS',
    source: 'https://photojournal.jpl.nasa.gov/catalog/pia16239',
  },
  perseverance: {
    nasaId: 'PIA24542', file: 'assets/nasa/PIA24542.jpg', available: true,
    caption: 'Perseverance with the Ingenuity helicopter, April 2021, assembled from 62 arm-camera images.',
    credit: 'Image: NASA/JPL-Caltech/MSSS',
    source: 'https://science.nasa.gov/photojournal/perseverances-selfie-with-ingenuity/',
  },
};

export const archivePhotos: ArchivePhoto[] = [
  {
    nasaId: 'AS11-40-5903', file: 'assets/nasa/AS11-40-5903.jpg', available: true,
    caption: 'Buzz Aldrin on the lunar surface. Neil Armstrong and the lunar module are reflected in his visor.',
    credit: 'Photo: Neil Armstrong / NASA',
    source: 'https://nssdc.gsfc.nasa.gov/imgcat/html/object_page/a11_h_40_5903.html',
  },
  {
    nasaId: 'AS11-40-5878', file: 'assets/nasa/AS11-40-5878.jpg', available: true,
    caption: 'A bootprint in the lunar soil, photographed to study the nature of the lunar dust.',
    credit: 'Photo: Buzz Aldrin / NASA',
    source: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11.html',
  },
  {
    nasaId: 'AS11-44-6642', file: 'assets/nasa/AS11-44-6642.jpg', available: true,
    caption: "Eagle's ascent stage returning to Columbia in lunar orbit, with Earth beyond.",
    credit: 'Photo: Michael Collins / NASA',
    source: 'https://nssdc.gsfc.nasa.gov/imgcat/html/object_page/a11_h_44_6642.html',
  },
];

export const publicUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const assetManifest = {
  assets,
  archivePhotos,
  pathfinderPhotos,
  roverPhotos,
  audio: { click: publicUrl('assets/audio/click-placeholder.wav') },
};

/** Scenes that still use placeholder art carry a small on-screen label. Set to false to hide the label. */
export const SHOW_PLACEHOLDER_LABEL = true;

export const isTemporary = (id: AssetId) => (assets[id] as AssetDef).status === 'temporary';

// ---- Loading and caching -------------------------------------------------

const decoded = new Map<string, Promise<boolean>>();
const ready = new Set<string>();

/** The best URL that is already decoded, falling back to the bundled illustration. */
export function currentUrl(id: AssetId, portrait = false): string {
  const def: AssetDef = assets[id];
  const preferred = finalUrl(def, portrait);
  return preferred && ready.has(preferred) ? preferred : def.fallback;
}

export function finalUrl(def: AssetDef, portrait = false) {
  const path = (portrait && def.mobileSrc) || def.src;
  return path ? publicUrl(path) : undefined;
}

/** Decode once and remember the result. Resolves false on a missing or broken file. */
export function loadUrl(url: string): Promise<boolean> {
  let pending = decoded.get(url);
  if (!pending) {
    const image = new Image();
    image.decoding = 'async';
    image.src = url;
    pending = image.decode().then(() => { ready.add(url); return true; }, () => false);
    decoded.set(url, pending);
  }
  return pending;
}

/** Warm the cache for the assets of upcoming beats. Only listed assets load; nothing from later chapters. */
export function preloadAssets(ids: Iterable<AssetId>, portrait = false) {
  for (const id of ids) {
    const def: AssetDef = assets[id];
    void loadUrl(def.fallback);
    const url = finalUrl(def, portrait);
    if (url) void loadUrl(url);
  }
}
