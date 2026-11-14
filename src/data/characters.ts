import type { AssetId } from './assetManifest';

export type CharacterId = 'mara' | 'eli' | 'pip';
/** flight: inside Aster. deck: Aster's observation deck (crew seen from behind; portraits use other art).
 * eva: outside on the lunar surface (sealed suits for Mara and Eli, lunar kit for Pip). mars: outside on Mars. */
export type Costume = 'flight' | 'deck' | 'eva' | 'mars';

export type Expression =
  | 'neutral' | 'smile' | 'happy' | 'laughing' | 'wry' | 'sarcastic' | 'grin' | 'serious' | 'surprised' | 'awed'
  | 'exasperated' | 'reflective' | 'thoughtful' | 'sad'
  // Pip's face screen
  | 'curious' | 'confused' | 'excited' | 'thinking' | 'analyzing' | 'scanning' | 'deadpan' | 'processing'
  | 'saving' | 'content';

type Look = {
  base: AssetId;
  /** Optional expression artwork. Missing expressions fall back to `base` plus an emote mark. */
  expressions?: Partial<Record<Expression, AssetId>>;
  /** Portrait crop inside the dialogue box: focus point (fractions of the drawing) and zoom. */
  portrait: { focus: readonly [number, number]; zoom: number };
  /** Where emote marks sit, as fractions of the drawing. */
  emote: readonly [number, number];
  /** Portrait cropped from a painted scene instead of the figure. `talking` is the open-mouth frame. */
  painted?: { closed: AssetId; talking?: AssetId; focus: readonly [number, number]; zoom: number };
};

export type Character = {
  id: CharacterId;
  name: string;
  role: string;
  voiceProfile: 'mara' | 'eli' | 'pip';
  looks: Record<Costume, Look>;
  /** Pip draws his expressions on his face screen instead of using emote marks. */
  faceScreen?: boolean;
};

export const characters: Record<CharacterId, Character> = {
  mara: {
    id: 'mara', name: 'MARA', role: 'Captain', voiceProfile: 'mara',
    looks: {
      flight: { base: 'mara', expressions: { smile: 'maraSmile' }, portrait: { focus: [0.6, 0.27], zoom: 2.15 }, emote: [0.86, 0.12],
        painted: { closed: 'cockpitTwoShot', talking: 'cockpitTwoShotMara', focus: [0.318, 0.5], zoom: 6.5 } },
      // The observation-deck painting shows Mara from behind, so her portrait uses the character sheet.
      deck: { base: 'mara', portrait: { focus: [0.6, 0.27], zoom: 2.15 }, emote: [0.86, 0.12],
        painted: { closed: 'maraSheet', focus: [0.123, 0.135], zoom: 5.4 } },
      eva: { base: 'maraEva', portrait: { focus: [0.6, 0.19], zoom: 2.6 }, emote: [0.84, 0.05],
        painted: { closed: 'moonCrewPainting', focus: [0.28, 0.3], zoom: 8 } },
      // No Mars painting yet: portraits reuse the lunar EVA painting until Mars art is delivered.
      mars: { base: 'maraMars', portrait: { focus: [0.6, 0.19], zoom: 2.6 }, emote: [0.84, 0.05],
        painted: { closed: 'moonCrewPainting', focus: [0.28, 0.3], zoom: 8 } },
    },
  },
  eli: {
    id: 'eli', name: 'ELI', role: 'Engineer', voiceProfile: 'eli',
    looks: {
      flight: { base: 'eli', portrait: { focus: [0.5, 0.25], zoom: 2.1 }, emote: [0.82, 0.08],
        painted: { closed: 'cockpitTwoShot', talking: 'cockpitTwoShotEli', focus: [0.272, 0.3], zoom: 6.5 } },
      deck: { base: 'eli', portrait: { focus: [0.5, 0.25], zoom: 2.1 }, emote: [0.82, 0.08],
        painted: { closed: 'cockpitTwoShot', talking: 'cockpitTwoShotEli', focus: [0.272, 0.3], zoom: 6.5 } },
      eva: { base: 'eliEva', portrait: { focus: [0.6, 0.19], zoom: 2.6 }, emote: [0.84, 0.05],
        painted: { closed: 'moonCrewPainting', focus: [0.452, 0.56], zoom: 8 } },
      mars: { base: 'eliMars', portrait: { focus: [0.6, 0.19], zoom: 2.6 }, emote: [0.84, 0.05],
        painted: { closed: 'moonCrewPainting', focus: [0.452, 0.56], zoom: 8 } },
    },
  },
  pip: {
    id: 'pip', name: 'PIP', role: 'Robot companion', voiceProfile: 'pip', faceScreen: true,
    looks: {
      flight: { base: 'pipFull', portrait: { focus: [0.5, 0.3], zoom: 1.85 }, emote: [0.9, 0.08] },
      deck: { base: 'pipFull', portrait: { focus: [0.5, 0.3], zoom: 1.85 }, emote: [0.9, 0.08] },
      eva: { base: 'pipLunar', portrait: { focus: [0.5, 0.3], zoom: 1.85 }, emote: [0.9, 0.08] },
      mars: { base: 'pipMars', portrait: { focus: [0.5, 0.3], zoom: 1.85 }, emote: [0.9, 0.08] },
    },
  },
};

export const isCharacterId = (value: string): value is CharacterId => Object.hasOwn(characters, value);

export type EmoteMark = 'sparkle' | 'sweat' | 'anger' | 'exclaim' | 'dots' | 'question' | 'squiggle';

/** Manga-style emote marks for the human crew. Pip's face screen covers his expressions. */
export const emoteFor: Partial<Record<Expression, EmoteMark>> = {
  smile: 'sparkle', grin: 'sparkle', awed: 'sparkle', happy: 'sparkle', laughing: 'sparkle',
  wry: 'sweat', sarcastic: 'squiggle',
  exasperated: 'anger', surprised: 'exclaim', excited: 'exclaim',
  reflective: 'dots', serious: 'dots', thoughtful: 'dots', sad: 'dots',
  confused: 'question',
};
