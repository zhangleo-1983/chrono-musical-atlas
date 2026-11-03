import { describe, expect, it } from 'vitest';
import { clamp, focusCenter, focusOn, FULL_BOX, IDENTITY, lerpViewport, pan, pinch, visibleBox, zoomAt } from './viewport';

describe('viewport math', () => {
  it('keeps the zoom anchor stable', () => {
    const before = { k: 2, x: -100, y: -40 }; const after = zoomAt(before, 300, 200, 1.5);
    const mapPoint = [(300 - before.x) / before.k, (200 - before.y) / before.k];
    expect((mapPoint[0]! * after.k + after.x)).toBeCloseTo(300); expect((mapPoint[1]! * after.k + after.y)).toBeCloseTo(200);
  });
  it('clamps scale and translation to the map bounds', () => {
    expect(clamp({ k: 20, x: 100, y: 100 }).k).toBe(8);
    expect(clamp({ k: 1, x: -200, y: 200 })).toEqual(IDENTITY);
    expect(pan({ k: 2, x: 0, y: 0 }, -9999, 9999).x).toBe(-1000);
  });
  it('computes a narrower visible box for a tall slice viewport', () => {
    expect(visibleBox(375, 812, 'meet')).toEqual(FULL_BOX);
    const box = visibleBox(375, 812, 'slice');
    expect(box.y0).toBe(0);
    expect(box.x1 - box.x0).toBeLessThan(1000);
    const left = pan(IDENTITY, -200, 0, box);
    expect(left.x).toBeGreaterThanOrEqual(box.x1 - 1000);
    expect(left.x).toBeLessThanOrEqual(box.x0);
    expect(pan(left, -9999, 0, box).x).toBe(box.x1 - 1000);
  });
  it('pinches around the midpoint and preserves a coincident gesture', () => {
    const before = { k: 1, x: 0, y: 0 };
    const after = pinch(before, [100, 100], [200, 100], [50, 100], [250, 100]);
    expect(after.k).toBe(2);
    const mapPoint = (x: number, y: number) => [(x - before.x) / before.k, (y - before.y) / before.k];
    const anchored = mapPoint(150, 100);
    expect(anchored[0]! * after.k + after.x).toBeCloseTo(150);
    expect(anchored[1]! * after.k + after.y).toBeCloseTo(100);
    expect(pinch(before, [100, 100], [100, 100], [50, 100], [250, 100])).toEqual(before);
  });
  it('centers focus inside the actual exposed screen interval', () => {
    const portraitCenter = focusCenter(FULL_BOX, 375, 812, 0, 375, 190, 341);
    expect(portraitCenter[0]).toBe(500);
    expect(portraitCenter[1]).toBeCloseTo(170.02, 1);
    const sliced = visibleBox(812, 375, 'slice');
    const center = focusCenter(sliced, 812, 375, 0, 430, 52, 375);
    expect(center[0]).toBeLessThan((sliced.x0 + sliced.x1) / 2);
    expect(center[0]).toBeCloseTo(sliced.x0 + (430 / 2 / 812) * (sliced.x1 - sliced.x0));
    expect(center[1]).toBeCloseTo(sliced.y0 + ((52 + 375) / 2 / 375) * (sliced.y1 - sliced.y0));
  });
  it('focuses and interpolates endpoints', () => {
    expect(focusOn([100, 80], 3, [500, 260])).toEqual({ k: 3, x: 200, y: 20 });
    const a = { k: 1, x: 0, y: 0 }; const b = { k: 4, x: -100, y: -50 };
    expect(lerpViewport(a, b, 0)).toEqual(a); expect(lerpViewport(a, b, 1)).toEqual(b);
  });
});
