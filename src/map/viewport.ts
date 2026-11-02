import { VIEW_H, VIEW_W } from './projection';

export interface Viewport { k: number; x: number; y: number }
export const IDENTITY: Viewport = { k: 1, x: 0, y: 0 };

export function clamp(v: Viewport): Viewport {
  const k = Math.max(1, Math.min(8, v.k));
  if (k === 1) return { ...IDENTITY };
  return { k, x: Math.max(VIEW_W - VIEW_W * k, Math.min(0, v.x)), y: Math.max(VIEW_H - VIEW_H * k, Math.min(0, v.y)) };
}
export function zoomAt(v: Viewport, px: number, py: number, factor: number): Viewport {
  const k = Math.max(1, Math.min(8, v.k * factor));
  return clamp({ k, x: px - (px - v.x) * (k / v.k), y: py - (py - v.y) * (k / v.k) });
}
export function pan(v: Viewport, dx: number, dy: number): Viewport { return clamp({ k: v.k, x: v.x + dx, y: v.y + dy }); }
export function focusOn(point: [number, number], k: number, center: [number, number]): Viewport { const zoom = Math.max(1, Math.min(8, k)); return { k: zoom, x: center[0] - point[0] * zoom, y: center[1] - point[1] * zoom }; }
export function lerpViewport(a: Viewport, b: Viewport, t: number): Viewport {
  const amount = Math.max(0, Math.min(1, t));
  return { k: a.k + (b.k - a.k) * amount, x: a.x + (b.x - a.x) * amount, y: a.y + (b.y - a.y) * amount };
}
