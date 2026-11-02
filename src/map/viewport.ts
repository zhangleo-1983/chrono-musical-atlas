import { VIEW_H, VIEW_W } from './projection';

export interface Viewport { k: number; x: number; y: number }
export interface VisibleBox { x0: number; y0: number; x1: number; y1: number }
export const IDENTITY: Viewport = { k: 1, x: 0, y: 0 };
export const FULL_BOX: VisibleBox = { x0: 0, y0: 0, x1: VIEW_W, y1: VIEW_H };

export function visibleBox(containerW: number, containerH: number, mode: 'meet' | 'slice'): VisibleBox {
  if (mode === 'meet' || containerW <= 0 || containerH <= 0) return FULL_BOX;
  const viewRatio = VIEW_W / VIEW_H;
  const containerRatio = containerW / containerH;
  if (containerRatio < viewRatio) {
    const width = VIEW_H * containerW / containerH;
    const x0 = (VIEW_W - width) / 2;
    return { x0, y0: 0, x1: x0 + width, y1: VIEW_H };
  }
  const height = VIEW_W * containerH / containerW;
  const y0 = (VIEW_H - height) / 2;
  return { x0: 0, y0, x1: VIEW_W, y1: y0 + height };
}

function clampAxis(value: number, worldSize: number, scale: number, start: number, end: number): number {
  const lower = end - worldSize * scale;
  const upper = start;
  if (lower > upper) return (lower + upper) / 2;
  return Math.max(lower, Math.min(upper, value));
}

export function clamp(v: Viewport, box: VisibleBox = FULL_BOX): Viewport {
  const k = Math.max(1, Math.min(8, v.k));
  return {
    k,
    x: clampAxis(v.x, VIEW_W, k, box.x0, box.x1),
    y: clampAxis(v.y, VIEW_H, k, box.y0, box.y1),
  };
}

export function zoomAt(v: Viewport, px: number, py: number, factor: number, box: VisibleBox = FULL_BOX): Viewport {
  const k = Math.max(1, Math.min(8, v.k * factor));
  return clamp({ k, x: px - (px - v.x) * (k / v.k), y: py - (py - v.y) * (k / v.k) }, box);
}

export function pan(v: Viewport, dx: number, dy: number, box: VisibleBox = FULL_BOX): Viewport {
  return clamp({ k: v.k, x: v.x + dx, y: v.y + dy }, box);
}

export function pinch(v: Viewport, a0: [number, number], b0: [number, number], a1: [number, number], b1: [number, number], box: VisibleBox = FULL_BOX): Viewport {
  const oldDx = b0[0] - a0[0]; const oldDy = b0[1] - a0[1];
  const oldDistance = Math.hypot(oldDx, oldDy);
  if (oldDistance === 0) return v;
  const newDistance = Math.hypot(b1[0] - a1[0], b1[1] - a1[1]);
  const factor = newDistance / oldDistance;
  const k = Math.max(1, Math.min(8, v.k * factor));
  const oldMid: [number, number] = [(a0[0] + b0[0]) / 2, (a0[1] + b0[1]) / 2];
  const newMid: [number, number] = [(a1[0] + b1[0]) / 2, (a1[1] + b1[1]) / 2];
  return clamp({
    k,
    x: oldMid[0] - (oldMid[0] - v.x) * (k / v.k) + newMid[0] - oldMid[0],
    y: oldMid[1] - (oldMid[1] - v.y) * (k / v.k) + newMid[1] - oldMid[1],
  }, box);
}

export function focusCenter(box: VisibleBox, containerH: number, topPx: number, bottomPx: number): [number, number] {
  const visibleHeight = box.y1 - box.y0;
  if (containerH <= 0 || visibleHeight <= 0) return [(box.x0 + box.x1) / 2, (box.y0 + box.y1) / 2];
  const top = Math.max(0, Math.min(containerH, topPx));
  const bottom = Math.max(top, Math.min(containerH, bottomPx));
  return [(box.x0 + box.x1) / 2, box.y0 + ((top + bottom) / 2 / containerH) * visibleHeight];
}

export function focusOn(point: [number, number], k: number, center: [number, number]): Viewport { const zoom = Math.max(1, Math.min(8, k)); return { k: zoom, x: center[0] - point[0] * zoom, y: center[1] - point[1] * zoom }; }
export function lerpViewport(a: Viewport, b: Viewport, t: number): Viewport {
  const amount = Math.max(0, Math.min(1, t));
  return { k: a.k + (b.k - a.k) * amount, x: a.x + (b.x - a.x) * amount, y: a.y + (b.y - a.y) * amount };
}
