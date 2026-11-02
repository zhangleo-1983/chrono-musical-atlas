import { describe, expect, it } from 'vitest';
import { radarPoints } from './radar';

describe('radar geometry', () => {
  it('maps zero to center and 100 to a top first axis', () => {
    const zero = radarPoints({ rhythm: 0, harmony: 0, improvisation: 0, ensemble: 0, fusion: 0 }, 50, 50, 30);
    expect(zero.every(([x, y]) => x === 50 && y === 50)).toBe(true);
    const full = radarPoints({ rhythm: 100, harmony: 100, improvisation: 100, ensemble: 100, fusion: 100 }, 50, 50, 30);
    expect(full[0]![0]).toBeCloseTo(50); expect(full[0]![1]).toBeCloseTo(20);
  });
});
