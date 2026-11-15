import React from 'react';
import ActivityHud, { ActivityProgress } from '../../../components/interactions/ActivityHud';
import { useAudio } from '../../../components/audio/AudioContext';
import { useStoryActions } from '../../../story/StoryActions';
import type { FxProps } from '../../../story/fxRegistry';

// Interaction B — brush the Martian dust away to uncover Sojourner.
//
// The dust is a canvas covering this layer's box (the rover sits underneath, in the layer below). Dragging
// with the mouse or a finger erases dust under the brush. Progress is tracked on a coarse grid over the
// rover's area, so it does not depend on reading pixels back. When enough of the rover is clear the rest of
// the dust blows away and the story continues. "Brush here" is the keyboard / no-drag alternative: each
// press sweeps one band of dust.

const COLS = 28, ROWS = 18;
const THRESHOLD = 0.7;
/** Cells that count: an ellipse around the rover, which sits in the middle of the box. */
const inTarget = (c: number, r: number) => {
  const x = (c + 0.5) / COLS - 0.5, y = (r + 0.5) / ROWS - 0.5;
  return (x * x) / (0.33 * 0.33) + (y * y) / (0.33 * 0.33) <= 1;
};
const TARGET_TOTAL = (() => {
  let n = 0;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (inTarget(c, r)) n++;
  return n;
})();
/** Brush radius as a fraction of the box width. */
const BRUSH = 0.052;
/** Keyboard sweeps: bands across the rover, top to bottom. */
const SWEEPS = [0.22, 0.31, 0.4, 0.5, 0.6, 0.69, 0.78];

type Stroke = { x: number; y: number };

/** Deterministic pseudo-random numbers so the dust looks the same after every resize. */
function mulberry(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function paintDust(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, w, h);
  // A drift of dust: opaque over the rover, feathering out to nothing at every edge of the box
  // (an ellipse that touches the box, so no straight edge ever shows).
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(1, h / w);
  const mound = ctx.createRadialGradient(0, 0, w * 0.04, 0, 0, w / 2);
  mound.addColorStop(0, '#b06a44');
  mound.addColorStop(0.7, '#a05f3d');
  mound.addColorStop(0.86, 'rgba(150, 86, 56, 0.86)');
  mound.addColorStop(1, 'rgba(150, 86, 56, 0)');
  ctx.fillStyle = mound;
  ctx.beginPath();
  ctx.arc(0, 0, w / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Texture stays inside the drift.
  ctx.globalCompositeOperation = 'source-atop';
  const random = mulberry(1997);
  for (let i = 0; i < 260; i++) {
    const x = random() * w, y = random() * h, r = (0.01 + random() * 0.05) * w;
    const light = random() > 0.5;
    const blob = ctx.createRadialGradient(x, y, 0, x, y, r);
    blob.addColorStop(0, light ? 'rgba(214, 150, 104, 0.34)' : 'rgba(96, 48, 32, 0.3)');
    blob.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = blob;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // Wind ripples.
  ctx.strokeStyle = 'rgba(226, 170, 124, 0.3)';
  ctx.lineWidth = Math.max(1, w * 0.004);
  for (let i = 0; i < 9; i++) {
    const y = h * (0.16 + i * 0.085);
    ctx.beginPath();
    ctx.moveTo(w * 0.08, y);
    ctx.bezierCurveTo(w * 0.3, y - h * 0.03, w * 0.62, y + h * 0.035, w * 0.92, y - h * 0.01);
    ctx.stroke();
  }
}

function erase(ctx: CanvasRenderingContext2D, w: number, x: number, y: number) {
  const r = BRUSH * w;
  const brush = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
  brush.addColorStop(0, 'rgba(0, 0, 0, 1)');
  brush.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = brush;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export default function DustReveal({ id }: FxProps) {
  const { interactionTarget, interact, paused } = useStoryActions();
  const { playCue } = useAudio();
  const active = interactionTarget === id && !paused;
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const strokes = React.useRef<Stroke[]>([]);
  const cleared = React.useRef(new Set<number>());
  const lastCue = React.useRef(0);
  const sweep = React.useRef(0);
  const [progress, setProgress] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const redraw = React.useCallback(() => {
    const el = canvas.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    // Layout size (independent of the camera zoom), capped so phones stay smooth.
    const w = Math.min(1100, Math.round(el.offsetWidth * Math.min(window.devicePixelRatio || 1, 1.5)));
    const h = Math.round(w * (el.offsetHeight / el.offsetWidth));
    if (el.width !== w || el.height !== h) {
      el.width = w;
      el.height = h;
    }
    const ctx = el.getContext('2d');
    if (!ctx) return;
    paintDust(ctx, w, h);
    for (const s of strokes.current) erase(ctx, w, s.x * w, s.y * h);
  }, []);

  React.useLayoutEffect(() => {
    redraw();
    const el = canvas.current;
    if (!el) return;
    const observer = new ResizeObserver(redraw);
    observer.observe(el);
    return () => observer.disconnect();
  }, [redraw]);

  const mark = React.useCallback((nx: number, ny: number) => {
    // Mark every grid cell whose centre is under the brush.
    const rx = BRUSH * 0.8, ry = rx * 1.5;
    let changed = false;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!inTarget(c, r)) continue;
        const dx = ((c + 0.5) / COLS - nx) / rx, dy = ((r + 0.5) / ROWS - ny) / ry;
        if (dx * dx + dy * dy <= 1 && !cleared.current.has(r * COLS + c)) {
          cleared.current.add(r * COLS + c);
          changed = true;
        }
      }
    }
    if (changed) setProgress(cleared.current.size / TARGET_TOTAL);
  }, []);

  const brushAt = React.useCallback((nx: number, ny: number) => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    if (strokes.current.length < 6000) strokes.current.push({ x: nx, y: ny });
    erase(ctx, el.width, nx * el.width, ny * el.height);
    mark(nx, ny);
    const t = performance.now();
    if (t - lastCue.current > 170) {
      lastCue.current = t;
      playCue('brush');
    }
  }, [mark, playCue]);

  // Pointer drag: mouse, pen and touch. Positions are interpolated so fast strokes leave no gaps.
  const last = React.useRef<Stroke | null>(null);
  const toLocal = (e: React.PointerEvent<HTMLCanvasElement>): Stroke => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
  };
  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active || done) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    last.current = toLocal(e);
    brushAt(last.current.x, last.current.y);
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active || done || !last.current) return;
    const next = toLocal(e);
    const steps = Math.max(1, Math.ceil(Math.hypot(next.x - last.current.x, next.y - last.current.y) / (BRUSH * 0.35)));
    for (let i = 1; i <= steps; i++) {
      brushAt(last.current.x + ((next.x - last.current.x) * i) / steps, last.current.y + ((next.y - last.current.y) * i) / steps);
    }
    last.current = next;
  };
  const onUp = () => { last.current = null; };

  /** Keyboard / no-drag alternative: one band of dust per press. */
  const sweepOnce = () => {
    if (!active || done) return;
    const y = SWEEPS[sweep.current % SWEEPS.length];
    sweep.current++;
    for (let i = 0; i <= 26; i++) brushAt(0.16 + (0.68 * i) / 26, y + Math.sin(i / 3) * 0.02);
  };

  // Enough of the rover is clear: let the rest blow away, then hand back to the story.
  React.useEffect(() => {
    if (done || progress < THRESHOLD) return;
    setDone(true);
    playCue('reveal');
  }, [progress, done, playCue]);
  React.useEffect(() => {
    if (!done || paused) return;
    const timer = window.setTimeout(() => interact(id), 1500);
    return () => window.clearTimeout(timer);
  }, [done, paused, interact, id]);

  const shown = Math.min(1, progress / THRESHOLD);
  return <div className={`activity dust-reveal${done ? ' is-done' : ''}`} data-active={active} data-no-advance>
    <canvas ref={canvas} className="dust-canvas" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
      onPointerCancel={onUp} aria-hidden="true"/>
    {interactionTarget === id && <ActivityHud>
      <p className="activity-title">{done ? 'Something is under the dust…' : 'Brush the dust away'}</p>
      {!done && <p>Drag across the mound with your mouse or finger to uncover what Pip found.</p>}
      <div className="activity-row">
        <ActivityProgress value={shown} label="Dust removed"/>
        <button type="button" className="activity-button is-quiet" onClick={sweepOnce} disabled={!active || done}>Brush here</button>
      </div>
      <p className="sr-only" role="status">{done ? 'The dust is cleared.' : `${Math.round(shown * 100)} percent of the dust removed.`}</p>
    </ActivityHud>}
  </div>;
}
