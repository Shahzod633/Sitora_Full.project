import { gsap } from 'gsap';
import { assets, preloadAssets, type AssetId } from '../data/assetManifest';
import { characters, type CharacterId, type Costume, type Expression } from '../data/characters';
import { camTransform, resolveShot, restCam, type Cam, type Rect, type View } from './camera';
import { StoryTimer } from './timer';
import type {
  Beat, Caption, CameraSpec, Chapter, Cue, LayerDef, LayerSpec, LayerState, MusicCue, MusicMood, ScriptLine,
  ShotRef, SoundCue, StageDef, StageId, TransitionKind,
} from './types';

/** DOM handles a mounted StageView gives the Director. */
export type StageHandle = {
  root: HTMLElement;
  world: HTMLElement;
  layer: (id: string) => HTMLElement | undefined;
  cams: () => { el: HTMLElement; depth: number }[];
};

export type Phase = 'loading' | 'cinematic' | 'dialogue' | 'outro' | 'interaction' | 'confirm' | 'end';

export type Snapshot = {
  beatIndex: number;
  beat: Beat;
  stages: { key: number; id: StageId }[];
  phase: Phase;
  line?: ScriptLine;
  lineIndex: number;
  dialogueVisible: boolean;
  speaker?: CharacterId;
  expressions: Partial<Record<CharacterId, Expression>>;
  costume: Costume;
  captions: Caption[];
  interaction?: { target: string; hint?: string };
  confirm?: { label: string };
  portrait: boolean;
  paused: boolean;
};

export type DirectorOptions = {
  cue?: (cue: SoundCue) => void;
  /** Ambient bed: called whenever the resolved mood or level changes. */
  music?: (mood: MusicMood, level: number) => void;
  startAt?: number;
};

type Live = {
  layers: Record<string, LayerState>;
  camera: ShotRef;
  expressions: Partial<Record<CharacterId, Expression>>;
};

const MOTION_KEYS = new Set(['duration', 'delay', 'ease']);
const DIM = 0.62;
const toArray = <T,>(v: T | readonly T[] | undefined): T[] => (v === undefined ? [] : Array.isArray(v) ? [...v] : [v as T]);
const now = () => performance.now();

function stripMotion(target: object): LayerState {
  return Object.fromEntries(Object.entries(target).filter(([k]) => !MOTION_KEYS.has(k))) as LayerState;
}

function mergeState(into: LayerState, from: LayerState) {
  const { vars, flags, ...rest } = from;
  Object.assign(into, rest);
  if (vars) into.vars = { ...into.vars, ...vars };
  if (flags) into.flags = { ...into.flags, ...flags };
}

function flattenLayers(layers: LayerDef[], out = new Map<string, LayerDef>()) {
  for (const layer of layers) {
    out.set(layer.id, layer);
    if (layer.children) flattenLayers(layer.children, out);
  }
  return out;
}

/**
 * Plays a Chapter: owns progression, GSAP timelines, the camera and stage transitions.
 * React renders from immutable snapshots; per-frame animation is applied directly to the DOM,
 * so camera moves and layer tweens never re-render the scene.
 */
export class Director {
  readonly chapter: Chapter;
  private snap: Snapshot;
  private listeners = new Set<() => void>();
  private handles = new Map<number, StageHandle>();
  private cams = new Map<number, Cam>();
  private camTls = new Map<number, gsap.core.Timeline>();
  private layerMaps = new Map<StageId, Map<string, LayerDef>>();
  private activeKey = -1;
  private keySeq = 0;
  private pending?: { index: number; key: number; fromKey?: number; cut?: boolean };
  private live: Live = { layers: {}, camera: 'wide', expressions: {} };
  private beatTl?: gsap.core.Timeline;
  private lineTl?: gsap.core.Timeline;
  private transitionTl?: gsap.core.Timeline;
  private timer = new StoryTimer();
  private lockUntil = 0;
  private skipped = false;
  private view: View = { W: 1280, H: 720, portrait: false };
  private reduced = false;
  private motionQuery?: MediaQueryList;
  private veil?: HTMLElement | null;
  private grain?: HTMLElement | null;
  private dialogue?: { advance: () => void } | null;
  private destroyed = false;
  private musicState = '';

  constructor(chapter: Chapter, private options: DirectorOptions = {}) {
    this.chapter = chapter;
    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduced = this.motionQuery.matches;
    this.motionQuery.addEventListener('change', this.onMotionChange);
    const index = Math.min(Math.max(options.startAt ?? 0, 0), chapter.beats.length - 1);
    const beat = chapter.beats[index];
    const key = ++this.keySeq;
    this.pending = { index, key };
    const W = window.innerWidth || 1280, H = window.innerHeight || 720;
    this.view = { W, H, portrait: W / H < 1 };
    this.snap = {
      beatIndex: index, beat, stages: [{ key, id: beat.stage }], phase: 'loading', lineIndex: 0,
      dialogueVisible: false, expressions: {}, costume: chapter.stages[beat.stage].costume, captions: [],
      portrait: this.view.portrait, paused: false,
    };
  }

  // ---- React bindings ---------------------------------------------------

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.snap;

  veilRef = (el: HTMLElement | null) => { this.veil = el; };
  grainRef = (el: HTMLElement | null) => { this.grain = el; };
  setDialogue(handle: { advance: () => void } | null) { this.dialogue = handle; }

  registerStage(key: number, handle: StageHandle) {
    this.handles.set(key, handle);
    if (!this.cams.has(key)) this.cams.set(key, restCam());
    // Defer until the whole commit (including overlay refs) has finished, still before paint.
    if (this.pending?.key === key) queueMicrotask(() => this.mountPending());
  }

  unregisterStage(key: number, handle: StageHandle) {
    if (this.handles.get(key) === handle) this.handles.delete(key);
  }

  resize(W: number, H: number) {
    if (W < 2 || H < 2) return;
    const portrait = W / H < 1;
    const changed = Math.abs(W - this.view.W) > 2 || Math.abs(H - this.view.H) > 2;
    this.view = { W, H, portrait };
    if (portrait !== this.snap.portrait) this.patch({ portrait }); // React recomposes, then calls reflow()
    else if (changed) this.reflow();
  }

  /** Re-apply the current state after the viewport or composition changed. */
  reflow() {
    const handle = this.handles.get(this.activeKey);
    if (!handle || this.pending) return;
    this.beatTl?.progress(1);
    this.lineTl?.progress(1);
    this.camTls.get(this.activeKey)?.progress(1);
    this.setInstant(handle, this.live.layers);
    Object.assign(this.cams.get(this.activeKey)!, this.solve(this.activeKey, this.live.camera));
    this.applyCam(this.activeKey, false);
  }

  destroy() {
    this.destroyed = true;
    this.timer.dispose();
    this.motionQuery?.removeEventListener('change', this.onMotionChange);
    this.beatTl?.kill();
    this.lineTl?.kill();
    this.transitionTl?.kill();
    this.camTls.forEach(tl => tl.kill());
    this.listeners.clear();
  }

  // ---- Pause ------------------------------------------------------------

  /** Freeze the story: pending progression, every running timeline and (via `paused`) the typewriter. */
  pause() {
    if (this.snap.paused || this.destroyed) return;
    this.timer.pause();
    for (const tl of this.timelines()) tl.pause();
    this.patch({ paused: true });
  }

  resume() {
    if (!this.snap.paused || this.destroyed) return;
    for (const tl of this.timelines()) tl.resume();
    this.timer.resume();
    this.lock(250);
    this.patch({ paused: false });
  }

  private timelines() {
    return [this.beatTl, this.lineTl, this.transitionTl, ...this.camTls.values()]
      .filter((tl): tl is gsap.core.Timeline => !!tl);
  }

  // ---- Reader input ------------------------------------------------------

  /** Click, tap, Space, Enter or → anywhere on the story. */
  primary() {
    if (this.snap.paused || now() < this.lockUntil) return;
    switch (this.snap.phase) {
      case 'dialogue': this.dialogue?.advance(); break;
      case 'cinematic': this.skip(); break;
      case 'outro':
        this.lock(300);
        this.lineTl?.progress(1);
        this.camTls.get(this.activeKey)?.progress(1);
        this.next();
        break;
      default: break;
    }
  }

  /** Called by the dialogue box once the current line is fully shown and the reader continues. */
  advanceLine = () => {
    if (this.snap.paused || this.snap.phase !== 'dialogue' || now() < this.lockUntil) return;
    this.lock(200);
    const lines = this.snap.beat.dialogue ?? [];
    if (this.snap.lineIndex + 1 < lines.length) this.showLine(this.snap.lineIndex + 1);
    else this.afterDialogue();
  };

  interact(target: string) {
    if (this.snap.paused || this.snap.phase !== 'interaction' || this.snap.interaction?.target !== target || now() < this.lockUntil) return;
    this.lock(400);
    this.cue('hotspot');
    this.patch({ interaction: undefined });
    this.next();
  }

  confirm() {
    if (this.snap.paused || this.snap.phase !== 'confirm' || now() < this.lockUntil) return;
    this.lock(400);
    this.patch({ confirm: undefined });
    this.next();
  }

  /** Development: jump to any beat with its fully resolved state. */
  jump(index: number) {
    if (index < 0 || index >= this.chapter.beats.length) return;
    this.go(index, true);
  }

  // ---- Progression -------------------------------------------------------

  private next() {
    const { beat, beatIndex } = this.snap;
    const target = beat.next ? this.chapter.beats.findIndex(b => b.id === beat.next) : beatIndex + 1;
    if (target >= 0 && target < this.chapter.beats.length) this.go(target);
  }

  private go(index: number, cut = false) {
    if (this.destroyed) return;
    this.timer.clear();
    this.skipped = false;
    this.beatTl?.progress(1).kill();
    this.lineTl?.progress(1).kill();
    this.beatTl = this.lineTl = undefined;
    const beat = this.chapter.beats[index];
    const activeStage = this.snap.stages.find(s => s.key === this.activeKey)?.id;
    if (cut || beat.stage !== activeStage) {
      this.transitionTl?.progress(1);
      const key = ++this.keySeq;
      const fromKey = cut ? undefined : this.activeKey;
      this.pending = { index, key, fromKey, cut };
      const kept = cut ? [] : this.snap.stages.filter(s => s.key === this.activeKey);
      if (cut) {
        for (const s of this.snap.stages) {
          this.camTls.get(s.key)?.kill();
          this.camTls.delete(s.key);
          this.cams.delete(s.key);
        }
        if (this.veil) gsap.set(this.veil, { autoAlpha: 0 });
        if (this.grain) gsap.set(this.grain, { autoAlpha: 0 });
      }
      this.patch({
        stages: [...kept, { key, id: beat.stage }], phase: 'loading', dialogueVisible: false,
        interaction: undefined, confirm: undefined, captions: [], speaker: undefined,
      });
    } else {
      this.play(index, 0, false);
    }
  }

  private mountPending() {
    const pending = this.pending;
    if (!pending || this.destroyed) return;
    const handle = this.handles.get(pending.key);
    if (!handle) return;
    this.pending = undefined;
    const { index, key, fromKey, cut } = pending;
    const beat = this.chapter.beats[index];
    this.activeKey = key;
    this.live = this.resolveBefore(index);
    this.setInstant(handle, this.live.layers);
    if (beat.from) {
      for (const [id, state] of Object.entries(beat.from)) mergeState(this.live.layers[id] ??= {}, state);
      this.setInstant(handle, beat.from);
    }
    const cam = this.cams.get(key)!;
    Object.assign(cam, this.solve(key, beat.camera?.from ?? this.live.camera));
    this.applyCam(key, false);
    const kind: TransitionKind = cut ? 'cut' : beat.transition?.kind ?? (fromKey === undefined ? 'black' : 'crossfade');
    const delay = this.transition(kind, fromKey, key, beat.transition?.duration);
    this.play(index, delay, true);
  }

  private play(index: number, delay: number, entering: boolean) {
    const beat = this.chapter.beats[index];
    const key = this.activeKey;
    const handle = this.handles.get(key);
    if (!handle) return;
    const tl = gsap.timeline({ delay });
    this.beatTl = tl;
    if (!entering && beat.from) {
      for (const [id, state] of Object.entries(beat.from)) mergeState(this.live.layers[id] ??= {}, state);
      this.setInstant(handle, beat.from);
    }
    this.applyCue(tl, beat, delay, entering);
    const stage = this.chapter.stages[beat.stage];
    const keepBox = this.snap.dialogueVisible && !!beat.dialogue?.length;
    this.patch({
      beatIndex: index, beat, phase: 'cinematic', lineIndex: 0, dialogueVisible: keepBox,
      speaker: keepBox ? this.snap.speaker : undefined, expressions: { ...this.live.expressions },
      costume: stage.costume, captions: toArray(beat.caption), interaction: undefined, confirm: undefined,
    });
    this.applyFocus(beat.focus);
    this.preloadAhead(index);
    this.applyMusic(index);

    const advance = beat.advance;
    const ms = (s: number) => s * 1000;
    switch (advance.mode) {
      case 'auto':
        this.timer.set(() => this.next(), ms(delay + this.hold(advance.hold)));
        break;
      case 'dialogue':
        this.timer.set(() => this.showLine(0), ms(delay + (beat.dialogueDelay ?? (keepBox ? 0.25 : 0.5))));
        break;
      case 'interaction':
        this.timer.set(() => this.patch({ phase: 'interaction', interaction: { target: advance.target, hint: advance.hint } }), ms(delay + 0.9));
        break;
      case 'confirm':
        this.timer.set(() => this.patch({ phase: 'confirm', confirm: { label: advance.label } }), ms(delay + 1.2));
        break;
      case 'end':
        this.timer.set(() => this.patch({ phase: 'end' }), ms(delay + 1));
        break;
    }
  }

  private showLine(i: number) {
    const beat = this.snap.beat;
    const id = beat.dialogue?.[i];
    const line = id ? this.chapter.script[id] : undefined;
    if (!id || !line) return this.afterDialogue();
    this.timer.clear();
    this.lineTl?.progress(1).kill();
    const tl = gsap.timeline();
    this.lineTl = tl;
    const cue = beat.onLine?.[id];
    if (cue) this.applyCue(tl, cue, 0, false);
    if (line.expression) this.live.expressions[line.speaker] = line.expression;
    this.patch({
      phase: 'dialogue', line, lineIndex: i, dialogueVisible: true, speaker: line.speaker,
      expressions: { ...this.live.expressions },
    });
    this.applyFocus(cue?.focus ?? beat.focus ?? line.speaker);
    this.lock(160);
  }

  private afterDialogue() {
    const outro = this.snap.beat.outro;
    if (!outro) return this.next();
    this.lineTl?.progress(1).kill();
    const tl = gsap.timeline();
    this.lineTl = tl;
    this.applyCue(tl, outro, 0, false);
    this.patch({ phase: 'outro', dialogueVisible: false, speaker: undefined, expressions: { ...this.live.expressions } });
    this.applyFocus(outro.focus);
    this.timer.set(() => this.next(), this.hold(outro.hold) * 1000);
  }

  private skip() {
    this.lock(300);
    if (this.skipped && this.snap.beat.advance.mode === 'auto') return this.next();
    this.skipped = true;
    this.transitionTl?.progress(1);
    this.beatTl?.progress(1);
    this.camTls.get(this.activeKey)?.progress(1);
    if (this.snap.beat.advance.mode === 'auto') this.timer.set(() => this.next(), 650);
    else this.timer.flush();
  }

  private lock(ms: number) {
    this.lockUntil = now() + ms;
  }

  private hold(seconds: number) {
    return this.reduced ? Math.max(1.5, seconds * 0.75) : seconds;
  }

  // ---- State resolution --------------------------------------------------

  private layerMap(stage: StageId) {
    let map = this.layerMaps.get(stage);
    if (!map) this.layerMaps.set(stage, map = flattenLayers(this.chapter.stages[stage].layers));
    return map;
  }

  /** Stage defaults plus every earlier beat in the same uninterrupted visit to this stage. */
  private resolveBefore(index: number): Live {
    const beat = this.chapter.beats[index];
    const live: Live = { layers: {}, camera: 'wide', expressions: {} };
    for (const [id, def] of this.layerMap(beat.stage)) if (def.initial) live.layers[id] = { ...def.initial };
    let start = index;
    while (start > 0 && this.chapter.beats[start - 1].stage === beat.stage) start--;
    for (let i = start; i < index; i++) this.fold(live, this.chapter.beats[i]);
    return live;
  }

  private fold(live: Live, beat: Beat) {
    for (const [id, state] of Object.entries(beat.from ?? {})) mergeState(live.layers[id] ??= {}, state);
    const cues: Cue[] = [beat, ...(beat.dialogue ?? []).map(id => beat.onLine?.[id] ?? {}), beat.outro ?? {}];
    for (const id of beat.dialogue ?? []) {
      const line = this.chapter.script[id];
      if (line?.expression) live.expressions[line.speaker] = line.expression;
    }
    for (const cue of cues) {
      for (const [id, spec] of Object.entries(cue.layers ?? {})) {
        for (const frame of toArray(spec)) mergeState(live.layers[id] ??= {}, stripMotion(frame));
      }
      const moves = cue.camera ? toArray(cue.camera.to) : [];
      if (moves.length) live.camera = moves[moves.length - 1].shot;
      if (cue.expressions) Object.assign(live.expressions, cue.expressions);
    }
  }

  // ---- Applying cues -----------------------------------------------------

  private applyCue(tl: gsap.core.Timeline, cue: Cue, cameraDelay: number, cameraFromApplied: boolean) {
    const handle = this.handles.get(this.activeKey);
    if (!handle) return;
    for (const [id, spec] of Object.entries(cue.layers ?? {})) this.tweenLayer(tl, handle, id, spec);
    if (cue.expressions) Object.assign(this.live.expressions, cue.expressions);
    for (const sound of cue.sound ?? []) tl.call(() => this.cue(sound.cue), [], sound.at ?? 0);
    if (cue.camera) this.moveCamera(this.activeKey, cue.camera, cameraDelay, cameraFromApplied);
  }

  private tweenLayer(tl: gsap.core.Timeline, handle: StageHandle, id: string, spec: LayerSpec) {
    const el = handle.layer(id);
    if (!el) {
      if (import.meta.env.DEV) console.warn(`[storyboard] layer "${id}" not found on stage`);
      return;
    }
    let t = 0;
    for (const frame of toArray(spec)) {
      const { duration = 1, delay = 0, ease = 'power2.inOut' } = frame;
      const state = stripMotion(frame);
      t += delay;
      const d = this.reduced ? Math.min(duration, 0.3) : duration;
      if (state.flags) {
        const flags = state.flags;
        tl.call(() => setFlags(el, flags), [], t);
      }
      const vars = this.vars(state);
      if (Object.keys(vars).length) tl.to(el, { ...vars, duration: d, ease }, t);
      t += d;
      mergeState(this.live.layers[id] ??= {}, state);
    }
  }

  private setInstant(handle: StageHandle, layers: Record<string, LayerState>) {
    for (const [id, state] of Object.entries(layers)) {
      const el = handle.layer(id);
      if (!el) continue;
      const vars = this.vars(state);
      if (Object.keys(vars).length) gsap.set(el, vars);
      if (state.flags) setFlags(el, state.flags);
    }
  }

  private vars(state: LayerState): gsap.TweenVars {
    const v: gsap.TweenVars = {};
    if (state.opacity !== undefined) v.autoAlpha = state.opacity;
    if (state.dx !== undefined) v.x = (state.dx / 100) * this.view.W;
    if (state.dy !== undefined) v.y = (state.dy / 100) * this.view.H;
    if (state.xp !== undefined) v.xPercent = state.xp;
    if (state.yp !== undefined) v.yPercent = state.yp;
    if (state.scale !== undefined) v.scale = state.scale;
    if (state.rotation !== undefined) v.rotation = state.rotation;
    if (state.brightness !== undefined || state.blur !== undefined) {
      v.filter = `brightness(${state.brightness ?? 1}) blur(${state.blur ?? 0}px)`;
    }
    for (const [name, value] of Object.entries(state.vars ?? {})) v[`--${name}`] = value;
    return v;
  }

  /** Dim everyone except the focused character (speaker by default). */
  private applyFocus(focus: CharacterId | 'all' | undefined) {
    const handle = this.handles.get(this.activeKey);
    if (!handle) return;
    for (const def of this.layerMap(this.snap.beat.stage).values()) {
      if (!def.character) continue;
      const el = handle.layer(def.id);
      if (!el) continue;
      const lit = !focus || focus === 'all' || def.character === focus;
      el.dataset.speaking = String(this.snap.phase === 'dialogue' && def.character === this.snap.speaker);
      gsap.to(el, { filter: `brightness(${lit ? 1 : DIM})`, duration: this.reduced ? 0 : 0.45, ease: 'sine.out', overwrite: 'auto' });
    }
  }

  // ---- Camera ------------------------------------------------------------

  private solve(key: number, ref: ShotRef): Cam {
    const stage = this.stageOf(key);
    const shot = typeof ref === 'string' ? stage?.shots[ref] ?? stage?.shots.wide ?? {} : ref;
    if (import.meta.env.DEV && typeof ref === 'string' && stage && !stage.shots[ref]) {
      console.warn(`[storyboard] shot "${ref}" missing on stage ${stage.id}`);
    }
    const boundsId = shot.bounds ?? stage?.bounds;
    const bounds = boundsId ? this.rectOf(key, boundsId) : undefined;
    return resolveShot(shot, this.view, id => this.rectOf(key, id), bounds);
  }

  private stageOf(key: number): StageDef | undefined {
    const id = this.snap.stages.find(s => s.key === key)?.id;
    return id ? this.chapter.stages[id] : undefined;
  }

  private rectOf(key: number, id: string): Rect | undefined {
    const el = this.handles.get(key)?.layer(id);
    const stage = this.stageOf(key);
    if (!el || !stage) return undefined;
    const def = this.layerMap(stage.id).get(id);
    const state = key === this.activeKey ? this.live.layers[id] ?? {} : {};
    let x = 0, y = 0;
    let node: HTMLElement | null = el;
    while (node && !node.classList.contains('cam')) {
      x += node.offsetLeft;
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    const s = state.scale ?? 1;
    const w = el.offsetWidth * s, h = el.offsetHeight * s;
    const cx = x + el.offsetWidth / 2 + ((state.dx ?? 0) / 100) * this.view.W + ((state.xp ?? 0) / 100) * el.offsetWidth;
    const cy = y + el.offsetHeight / 2 + ((state.dy ?? 0) / 100) * this.view.H + ((state.yp ?? 0) / 100) * el.offsetHeight;
    return { x: cx - w / 2, y: cy - h / 2, w, h, depth: def?.depth ?? 1 };
  }

  private moveCamera(key: number, spec: CameraSpec, delay: number, fromApplied: boolean) {
    const cam = this.cams.get(key);
    if (!cam) return;
    this.camTls.get(key)?.kill();
    if (spec.from && !fromApplied) {
      Object.assign(cam, this.solve(key, spec.from));
      this.applyCam(key, false);
    }
    const tl = gsap.timeline({
      delay,
      onUpdate: () => this.applyCam(key, true),
      onComplete: () => this.applyCam(key, false),
    });
    let t = 0;
    for (const move of toArray(spec.to)) {
      t += move.delay ?? 0;
      const target = this.solve(key, move.shot);
      const d = this.reduced ? 0 : move.duration ?? 1.4;
      tl.to(cam, { ...target, duration: d, ease: move.ease ?? 'power2.inOut' }, t);
      t += d;
      if (key === this.activeKey) this.live.camera = move.shot;
    }
    this.camTls.set(key, tl);
  }

  private applyCam(key: number, moving: boolean) {
    const cam = this.cams.get(key);
    const handle = this.handles.get(key);
    if (!cam || !handle) return;
    for (const { el, depth } of handle.cams()) el.style.transform = camTransform(cam, depth, moving);
    // In-world labels divide their size by this so they read the same at any zoom.
    handle.root.style.setProperty('--cam-z', cam.z.toFixed(3));
  }

  // ---- Transitions -------------------------------------------------------

  /** Runs a stage transition and returns when (in seconds) the new beat should start animating. */
  private transition(kind: TransitionKind, fromKey: number | undefined, toKey: number, duration?: number): number {
    const to = this.handles.get(toKey)!;
    const from = fromKey !== undefined ? this.handles.get(fromKey) : undefined;
    const D = (s: number) => (this.reduced ? Math.min(s, 0.4) : s);
    const archiveFilter = 'grayscale(1) sepia(0.4) contrast(1.06) brightness(0.92)';
    const clearFilter = 'grayscale(0) sepia(0) contrast(1) brightness(1)';
    this.transitionTl?.progress(1);
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(to.root, { clearProps: 'filter,opacity,visibility' });
        gsap.set(to.world, { clearProps: 'transform' });
        if (fromKey !== undefined) this.dropStage(fromKey);
        if (this.transitionTl === tl) this.transitionTl = undefined;
      },
    });
    this.transitionTl = tl;
    let delay = 0;
    const veil = this.veil, grain = this.grain;
    // Without a previous stage there is nothing to blend from: open from black (or cut, for dev jumps).
    switch (from ? kind : kind === 'cut' ? 'cut' : 'black') {
      case 'cut':
        gsap.set(to.root, { autoAlpha: 1 });
        break;
      case 'crossfade': {
        const d = D(duration ?? 1.1);
        gsap.set(to.root, { autoAlpha: 0 });
        tl.to(to.root, { autoAlpha: 1, duration: d, ease: 'sine.inOut' }, 0);
        break;
      }
      case 'black': {
        gsap.set(to.root, { autoAlpha: 0 });
        if (veil) {
          if (from) tl.fromTo(veil, { autoAlpha: 0 }, { autoAlpha: 1, duration: D(0.9), ease: 'sine.in' }, 0);
          else gsap.set(veil, { autoAlpha: 1 });
        }
        delay = from ? D(1.0) : 0.15;
        tl.set(to.root, { autoAlpha: 1 }, delay);
        if (veil) tl.to(veil, { autoAlpha: 0, duration: D(duration ?? 1.6), ease: 'sine.out' }, delay);
        break;
      }
      case 'push': {
        const d = D(duration ?? 1.2);
        gsap.set(to.root, { autoAlpha: 0 });
        if (!this.reduced) {
          tl.to(from!.world, { scale: 1.4, duration: d, ease: 'power2.in', transformOrigin: '50% 45%' }, 0);
          tl.fromTo(to.world, { scale: 1.14 }, { scale: 1, duration: d * 1.6, ease: 'power3.out', transformOrigin: '50% 50%' }, d * 0.35);
        }
        tl.to(to.root, { autoAlpha: 1, duration: d * 0.8, ease: 'sine.inOut' }, d * 0.35);
        delay = d * 0.35;
        break;
      }
      case 'archive': {
        const d = D(duration ?? 1.4);
        gsap.set(to.root, { autoAlpha: 0 });
        tl.fromTo(from!.root, { filter: clearFilter }, { filter: archiveFilter, duration: d, ease: 'sine.inOut' }, 0);
        if (grain) tl.fromTo(grain, { autoAlpha: 0 }, { autoAlpha: 1, duration: d * 0.8 }, d * 0.2);
        tl.to(to.root, { autoAlpha: 1, duration: D(1.2), ease: 'sine.inOut' }, d);
        if (grain) tl.to(grain, { autoAlpha: 0, duration: D(0.8) }, d + D(1.2));
        delay = d;
        break;
      }
      case 'present': {
        const d = D(duration ?? 1.2);
        gsap.set(to.root, { autoAlpha: 0, filter: archiveFilter });
        if (grain) tl.fromTo(grain, { autoAlpha: 0 }, { autoAlpha: 1, duration: D(0.5) }, 0);
        tl.to(to.root, { autoAlpha: 1, duration: d, ease: 'sine.inOut' }, D(0.3));
        tl.to(to.root, { filter: clearFilter, duration: D(2), ease: 'sine.inOut' }, D(0.3) + d * 0.7);
        if (grain) tl.to(grain, { autoAlpha: 0, duration: D(1.4) }, D(0.3) + d);
        delay = D(0.3);
        break;
      }
    }
    if (tl.duration() === 0) tl.progress(1);
    return delay;
  }

  private dropStage(key: number) {
    this.camTls.get(key)?.kill();
    this.camTls.delete(key);
    this.cams.delete(key);
    this.patch({ stages: this.snap.stages.filter(s => s.key !== key) });
  }

  // ---- Misc --------------------------------------------------------------

  private preloadAhead(index: number) {
    const ids = new Set<AssetId>();
    for (const beat of this.chapter.beats.slice(index, index + 4)) {
      const stage = this.chapter.stages[beat.stage];
      for (const def of this.layerMap(stage.id).values()) {
        if (def.asset) ids.add(def.asset);
        for (const value of Object.values(def.props ?? {})) {
          if (typeof value === 'string' && Object.hasOwn(assets, value)) ids.add(value as AssetId);
        }
        if (def.character) {
          const look = characters[def.character].looks[stage.costume];
          ids.add(look.base);
          Object.values(look.expressions ?? {}).forEach(id => ids.add(id));
        }
      }
    }
    preloadAssets(ids, this.view.portrait);
  }

  private cue(name: SoundCue) {
    try { this.options.cue?.(name); } catch { /* Sound must never block the story. */ }
  }

  /** Mood and level persist from earlier beats on the same stage visit, so a jump lands on the right ambience. */
  private applyMusic(index: number) {
    if (!this.options.music) return;
    const beats = this.chapter.beats;
    const stage = this.chapter.stages[beats[index].stage];
    let mood: MusicMood | undefined;
    let level: number | undefined;
    for (let i = index; i >= 0 && beats[i].stage === stage.id; i--) {
      const cue: MusicCue | undefined = beats[i].music;
      if (mood === undefined && cue?.mood) mood = cue.mood;
      if (level === undefined && cue?.level !== undefined) level = cue.level;
      if (mood !== undefined && level !== undefined) break;
    }
    const resolved: MusicMood = mood ?? stage.music ?? 'silence';
    const state = `${resolved}:${level ?? 1}`;
    if (state === this.musicState) return;
    this.musicState = state;
    try { this.options.music(resolved, level ?? 1); } catch { /* Sound must never block the story. */ }
  }

  private patch(update: Partial<Snapshot>) {
    if (this.destroyed) return;
    this.snap = { ...this.snap, ...update };
    this.listeners.forEach(listener => listener());
  }

  private onMotionChange = (event: MediaQueryListEvent) => {
    this.reduced = event.matches;
  };
}

function setFlags(el: HTMLElement, flags: Record<string, boolean | string>) {
  for (const [name, value] of Object.entries(flags)) el.dataset[name] = String(value);
}
