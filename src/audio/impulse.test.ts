import { describe, expect, it } from 'vitest';
import { generateImpulse } from './impulse';

describe('reverb impulse generation', () => {
  it('creates independent decaying stereo noise', () => {
    let seed = 0;
    const [left, right] = generateImpulse(2.2, 1000, () => ((seed += 37) % 101) / 100);
    expect(left).toHaveLength(2200);
    expect(right).toHaveLength(2200);
    expect(left[0]).not.toBe(right[0]);
    const early = Math.abs(left[0]!) + Math.abs(right[0]!);
    const late = Math.abs(left[2199]!) + Math.abs(right[2199]!);
    expect(late).toBeLessThan(early * 0.002);
  });
});
