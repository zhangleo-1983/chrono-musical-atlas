import { describe, expect, it } from 'vitest';
import { eraOf } from './eras';
import { eraRangeT, tToYear, yearToT } from './timeScale';

describe('time scale', () => {
  it('uses the half-open era boundaries', () => {
    expect(eraOf(500)).toBe('medieval');
    expect(eraOf(1970)).toBe('contemporary');
  });
  it('round-trips representative years', () => {
    for (const year of [-1500, -600, 500, 1200, 1600, 1770, 1820, 1900, 1910, 1969, 1970, 2000, 2026]) {
      expect(Math.abs(tToYear(yearToT(year)) - year)).toBeLessThanOrEqual(1);
    }
  });
  it('maps each era to one equal segment', () => {
    expect(eraRangeT('ancient')).toEqual([0, 1 / 6]);
    expect(eraRangeT('contemporary')).toEqual([5 / 6, 1]);
    expect(yearToT(-999)).toBeGreaterThan(0);
    expect(yearToT(9999)).toBe(1);
  });
});
