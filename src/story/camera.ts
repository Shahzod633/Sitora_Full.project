import type { CSSProperties } from 'react';
import type { Box, CameraShot, LayerDef } from './types';

/** Camera transform for depth 1. Layers with depth d receive a proportional share (parallax). */
export type Cam = { tx: number; ty: number; z: number };
export type View = { W: number; H: number; portrait: boolean };
export type Rect = { x: number; y: number; w: number; h: number; depth: number };

export const restCam = (): Cam => ({ tx: 0, ty: 0, z: 1 });

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Solve the camera that frames `shot` on the current viewport. Pure: no DOM access. */
export function resolveShot(shot: CameraShot, view: View, rectOf: (id: string) => Rect | undefined, bounds?: Rect): Cam {
  const s: CameraShot = view.portrait && shot.portrait ? { ...shot, ...shot.portrait } : shot;
  const { W, H } = view;
  const ids = s.target === undefined ? [] : typeof s.target === 'string' ? [s.target] : s.target;
  const rects = ids.map(rectOf).filter((r): r is Rect => !!r);
  let fx = W / 2, fy = H / 2, tw = W, th = H, depth = 1;
  if (rects.length) {
    const x0 = Math.min(...rects.map(r => r.x)), y0 = Math.min(...rects.map(r => r.y));
    const x1 = Math.max(...rects.map(r => r.x + r.w)), y1 = Math.max(...rects.map(r => r.y + r.h));
    tw = Math.max(1, x1 - x0); th = Math.max(1, y1 - y0);
    depth = rects[0].depth > 0 ? rects[0].depth : 1;
    const [ax, ay] = s.focus ?? [0.5, 0.5];
    fx = x0 + tw * ax; fy = y0 + th * ay;
  } else if (s.point) {
    fx = (s.point[0] / 100) * W; fy = (s.point[1] / 100) * H;
  }
  let z = s.zoom ?? (s.fill && rects.length ? Math.min((s.fill * W) / tw, (s.fill * H) / th) : 1);
  z = clamp(z, 1, s.maxZoom ?? 3.2);
  const [sx, sy] = s.screen ?? [0.5, 0.5];
  const planeScale = 1 + (z - 1) * depth;
  // A layer at depth d is drawn at p * (1 + (z - 1) d) + t d. Solve t so the focus lands on (sx, sy).
  // Keep the frame inside the content: the viewport by default, or a painting that overflows it
  // (so narrow screens can pan across the whole painting).
  const b = bounds ?? { x: 0, y: 0, w: W, h: H };
  const fit = (t: number, size: number, start: number, length: number) => {
    const lo = size - (start + length) * z, hi = -start * z;
    return lo > hi ? (lo + hi) / 2 : clamp(t, lo, hi);
  };
  const tx = fit((sx * W - fx * planeScale) / depth, W, b.x, b.w);
  const ty = fit((sy * H - fy * planeScale) / depth, H, b.y, b.h);
  return { tx, ty, z };
}

export function camTransform(cam: Cam, depth: number, moving: boolean) {
  const s = 1 + (cam.z - 1) * depth;
  const x = cam.tx * depth, y = cam.ty * depth;
  // 3D while moving keeps the layer on the compositor; 2D at rest re-rasterises the art sharply.
  return moving
    ? `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${s.toFixed(4)})`
    : `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${s.toFixed(4)})`;
}

/** Responsive CSS for a layer box. All lengths stay in CSS so the browser does the layout. */
export function boxStyle(def: LayerDef, portrait: boolean, aspectFallback?: number): CSSProperties {
  const box: Box = portrait && def.portrait ? { ...def.box, ...def.portrait } : def.box;
  if (!box.w && !box.h) {
    // Point layer (labels, cards): content sizes itself and is anchored around (x, y) in CSS.
    const [px, py] = box.anchor ?? [0.5, 0.5];
    return { left: `${box.x}%`, top: `${box.y}%`, width: 0, height: 0, '--ax': px, '--ay': py } as CSSProperties;
  }
  const aspect = box.aspect ?? aspectFallback ?? 1;
  const w = box.w ?? `calc(${box.h} * ${aspect})`;
  const h = box.h ?? `calc(${box.w} / ${aspect})`;
  const [ax, ay] = box.anchor ?? [0.5, 0.5];
  return {
    width: w,
    height: h,
    left: `calc(${box.x}% - (${w}) * ${ax})`,
    top: `calc(${box.y}% - (${h}) * ${ay})`,
  };
}
