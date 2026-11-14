// Asset manifest for Chapter 01.
//
// Every illustration has a bundled TEMPORARY fallback (src/assets/chapter01/*.svg) and an optional `src`
// for the artists' final file in public/. Drop the delivered file into public/, set `src` (and `mobileSrc`
// for an optional portrait crop) and the story swaps it in once it decodes. Source images are never
// modified: framing is done by the camera and layer boxes in chapters/chapter01/stages.ts.
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

export type AssetKind = 'background' | 'object' | 'character' | 'reconstruction';
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
  moonCrewPainting: asset({ kind: 'background', fallback: moonSurface, src: 'assets/art/moon-crew.webp', aspect: 1721 / 914, fit: 'stretch', status: 'final',
    brief: 'Mara, Eli and Pip in EVA gear near the lunar base. Source has window-control icons in the top-right corner: cropped by framing; please supply a clean export.' }),
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
} as const;

export type AssetId = keyof typeof assets;

/** Archival photographs for the Apollo 11 flashback. Files are NOT bundled yet. Download the NASA originals,
 * save them under public/assets/nasa/ with the given file name and set `available: true`. */
export type ArchivePhoto = {
  nasaId: string;
  file: string;
  caption: string;
  credit: string;
  source: string;
  available: boolean;
};

export const archivePhotos: ArchivePhoto[] = [
  {
    nasaId: 'AS11-40-5903', file: 'assets/nasa/AS11-40-5903.jpg', available: false,
    caption: 'Buzz Aldrin on the lunar surface. Neil Armstrong and the lunar module are reflected in his visor.',
    credit: 'Photo: Neil Armstrong / NASA',
    source: 'https://nssdc.gsfc.nasa.gov/imgcat/html/object_page/a11_h_40_5903.html',
  },
  {
    nasaId: 'AS11-40-5878', file: 'assets/nasa/AS11-40-5878.jpg', available: false,
    caption: 'A bootprint in the lunar soil, photographed to study the nature of the lunar dust.',
    credit: 'Photo: Buzz Aldrin / NASA',
    source: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11.html',
  },
  {
    nasaId: 'AS11-44-6642', file: 'assets/nasa/AS11-44-6642.jpg', available: false,
    caption: "Eagle's ascent stage returning to Columbia in lunar orbit, with Earth beyond.",
    credit: 'Photo: Michael Collins / NASA',
    source: 'https://nssdc.gsfc.nasa.gov/imgcat/html/object_page/a11_h_44_6642.html',
  },
];

export const publicUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const assetManifest = {
  assets,
  archivePhotos,
  audio: { click: publicUrl('assets/audio/click-placeholder.wav') },
};

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
