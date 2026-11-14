import type { AssetId } from '../data/assetManifest';
import type { CharacterId, Costume, Expression } from '../data/characters';

// ---------------------------------------------------------------------------
// Content model for a cinematic chapter.
//
// Chapter  → Sequences (A–F, for navigation/progress)
//          → Beats (ordered story moments; data only)
//          → Stages (reusable illustrated locations made of layers + named camera shots)
//
// Beats never contain animation code. The Director (story/Director.ts) turns their declarative
// layer states, camera shots and progression rules into GSAP timelines.
// ---------------------------------------------------------------------------

export type Vec2 = readonly [number, number];

/** Responsive layer box. Lengths are CSS (cqw/cqh/cqmin/%), resolved against the story viewport. */
export type Box = {
  /** Anchor position in % of the viewport width / height. */
  x: number;
  y: number;
  w?: string;
  h?: string;
  /** Width / height, used when only one of w or h is given. */
  aspect?: number;
  /** Fraction of the box placed at (x, y). Default [0.5, 0.5]. */
  anchor?: Vec2;
};

/** Animatable state of a layer. dx/dy are offsets in % of viewport width/height. */
export type LayerState = {
  opacity?: number;
  dx?: number;
  dy?: number;
  /** Offsets in % of the layer's own size (responsive movement for attachments). */
  xp?: number;
  yp?: number;
  scale?: number;
  rotation?: number;
  brightness?: number;
  blur?: number;
  /** CSS custom properties tweened on the layer (e.g. { progress: 1 } → --progress). */
  vars?: Record<string, number>;
  /** Discrete flags written as data attributes when the tween starts (walk, flip, active…). */
  flags?: Record<string, boolean | string>;
};

export type Motion = { duration?: number; delay?: number; ease?: string };
export type LayerTarget = LayerState & Motion;
/** A single target, or keyframes played one after another. */
export type LayerSpec = LayerTarget | LayerTarget[];

export type FxKind =
  | 'glow' | 'thruster' | 'vignette' | 'marsGlint' | 'nameTag' | 'hud' | 'pipDiag' | 'landingPad'
  | 'refuelLine' | 'statusTag' | 'dust' | 'landingGlow' | 'perimeter' | 'reticle' | 'scanWave'
  | 'hotspot' | 'dateCard' | 'archivePanel' | 'filmGrain' | 'label' | 'archiveBackdrop' | 'endCard'
  | 'talkingPainting' | 'pipStatus';

export type LayerDef = {
  id: string;
  /** Illustration from the asset manifest… */
  asset?: AssetId;
  /** …or a character (picks costume + expression art automatically)… */
  character?: CharacterId;
  /** …or a reusable effect component. */
  fx?: FxKind;
  props?: Record<string, string | number | boolean>;
  box: Box;
  /** Overrides for portrait viewports (taller than wide): recompose instead of shrinking. */
  portrait?: Partial<Box>;
  /** Parallax depth. 0 = fixed to the screen, 1 = moves fully with the camera. Default 1. */
  depth?: number;
  /** Default state whenever the stage is (re)entered. */
  initial?: LayerState;
  label?: string;
  /** Child layers positioned in % of this layer's box (attachments such as a hotspot on the lander). */
  children?: LayerDef[];
};

export type CameraShot = {
  /** Layer id(s) to frame. Their combined box is used for `fill` and `focus`. */
  target?: string | readonly string[];
  /** Or a point in % of the viewport. */
  point?: Vec2;
  /** Point inside the target box (fractions) that the camera centres. Default [0.5, 0.5]. */
  focus?: Vec2;
  /** Fraction of the viewport the target should occupy (responsive zoom). */
  fill?: number;
  /** Explicit zoom (1 = whole stage). Overrides fill. */
  zoom?: number;
  /** Where the focus point lands on screen (fractions). Default [0.5, 0.5]. */
  screen?: Vec2;
  maxZoom?: number;
  /** Layer whose box limits the frame (a painting larger than the viewport). Defaults to the stage's `bounds`. */
  bounds?: string;
  portrait?: Omit<CameraShot, 'portrait'>;
};

export type ShotRef = string | CameraShot;
export type CameraMove = Motion & { shot: ShotRef };
export type CameraSpec = {
  /** Shot to cut to before moving (used when a beat opens a stage). */
  from?: ShotRef;
  /** One move, or moves played one after another. */
  to: CameraMove | CameraMove[];
};

export type StageId = 'orbit' | 'cockpit' | 'lunarBase' | 'apolloSite' | 'archive' | 'ending';

export type StageDef = {
  id: StageId;
  label: string;
  /** Palette family: space, interior, moon, archive, black. */
  tone: 'space' | 'interior' | 'moon' | 'archive' | 'black';
  /** Portrait art used by the dialogue box while this stage is active. */
  costume: Costume;
  layers: LayerDef[];
  /** Named camera framing presets for this stage. `wide` is the default. */
  shots: Record<string, CameraShot>;
  /** Default camera bounds layer (see CameraShot.bounds). Without it the viewport is the bound. */
  bounds?: string;
};

export type TransitionKind = 'cut' | 'crossfade' | 'black' | 'push' | 'archive' | 'present';

export type Caption = { kind: 'scene' | 'narration' | 'location'; text: string };

export type SoundCue = 'computer' | 'scan' | 'save' | 'hotspot' | 'archive' | 'rumble';
export type SoundEvent = { cue: SoundCue; at?: number };

/** Changes applied together: on beat entry, when a line starts, or after the dialogue (outro). */
export type Cue = {
  layers?: Record<string, LayerSpec>;
  camera?: CameraSpec;
  expressions?: Partial<Record<CharacterId, Expression>>;
  sound?: SoundEvent[];
  /** Explicit character focus (dims the others). Defaults to the current speaker. */
  focus?: CharacterId | 'all';
};

export type Advance =
  /** Cinematic: continue automatically after `hold` seconds. Clicking fast-forwards. */
  | { mode: 'auto'; hold: number }
  /** Dialogue: the reader advances each line (click, tap, Space, Enter, →). */
  | { mode: 'dialogue' }
  /** Interactive: continue when the reader activates `target` (a hotspot layer). */
  | { mode: 'interaction'; target: string; hint: string }
  /** Reading moment: continue on an explicit button. */
  | { mode: 'confirm'; label: string }
  /** Chapter ending: stays until Replay. */
  | { mode: 'end' };

export type SequenceId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type Beat<LineId extends string = string> = Cue & {
  /** Stable id used by the dev overlay, docs and ?beat= deep links (development only). */
  id: string;
  slug: string;
  sequence: SequenceId;
  title: string;
  stage: StageId;
  /** How this beat enters when it opens a different stage. */
  transition?: { kind: TransitionKind; duration?: number };
  /** States set instantly when the beat starts (before tweening `layers`). */
  from?: Record<string, LayerState>;
  /** Screenplay lines spoken in this beat, by id. */
  dialogue?: readonly LineId[];
  /** Per-line cues (camera reframe, expression, scan effect…) keyed by line id. */
  onLine?: Partial<Record<LineId, Cue>>;
  /** Wordless moment after the last line (e.g. "Mara smiles"), then continue after `hold`. */
  outro?: Cue & { hold: number };
  /** Delay before the first line, so the camera can settle. Default 0.45s. */
  dialogueDelay?: number;
  caption?: Caption | Caption[];
  advance: Advance;
  /** Next beat id. Defaults to the following beat. */
  next?: string;
};

export type ScriptLine<LineId extends string = string> = {
  id: LineId;
  speaker: CharacterId;
  text: string;
  expression?: Expression;
};

export type Chapter<LineId extends string = string> = {
  id: string;
  number: string;
  title: string;
  sequences: Record<SequenceId, string>;
  script: Record<LineId, ScriptLine<LineId>>;
  /** Screenplay order, used to verify every line appears once and in order. */
  scriptOrder: readonly LineId[];
  stages: Record<StageId, StageDef>;
  beats: Beat<LineId>[];
};
