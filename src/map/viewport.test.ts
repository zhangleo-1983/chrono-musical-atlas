import { describe, expect, it } from 'vitest';
import { clamp, focusOn, IDENTITY, lerpViewport, pan, zoomAt } from './viewport';

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
  it('focuses and interpolates endpoints', () => {
    expect(focusOn([100, 80], 3, [500, 260])).toEqual({ k: 3, x: 200, y: 20 });
    const a = { k: 1, x: 0, y: 0 }; const b = { k: 4, x: -100, y: -50 };
    expect(lerpViewport(a, b, 0)).toEqual(a); expect(lerpViewport(a, b, 1)).toEqual(b);
  });
});
