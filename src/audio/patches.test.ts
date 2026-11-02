import { describe, expect, it } from 'vitest';
import { PATCHES, patchCycleLength, stepTime } from './patches';

describe('audio patches', () => {
  it('contains eight distinct bounded patterns', () => {
    const patches = Object.values(PATCHES);
    expect(patches).toHaveLength(8);
    for (const patch of patches) {
      const length = patchCycleLength(patch);
      for (const event of patch.events) {
        expect(event.step).toBeGreaterThanOrEqual(0); expect(event.step).toBeLessThan(length);
        if (event.midi !== undefined) expect(event.midi).toBeGreaterThanOrEqual(24); expect(event.midi === undefined || event.midi <= 108).toBe(true);
        expect(event.vel).toBeGreaterThan(0); expect(event.vel).toBeLessThanOrEqual(1);
      }
    }
    const pentatonic = PATCHES['pentatonic-pluck'];
    expect(pentatonic.events.every((event) => event.midi !== undefined && [0, 2, 4, 7, 9].includes(event.midi % 12))).toBe(true);
    for (let i = 0; i < 10; i += 1) expect(stepTime(i, { ...pentatonic, swing: 0 })).toBeCloseTo(i * 60 / pentatonic.bpm / pentatonic.stepsPerBeat);
    const signatures = patches.map((patch) => `${patch.bpm}:${JSON.stringify(patch.events)}`);
    expect(new Set(signatures).size).toBe(8);
    const classicalStep = PATCHES['classical-strings'].events.filter((event) => event.step === 0).flatMap((event) => event.midi === undefined ? [] : [event.midi]);
    expect(new Set(classicalStep).size).toBeGreaterThanOrEqual(3);
    const rockStep = PATCHES['rock-distortion'].events.filter((event) => event.step === 0).flatMap((event) => event.midi === undefined ? [] : [event.midi]);
    expect(rockStep.some((midi) => rockStep.includes(midi + 7))).toBe(true);
    const swingBassPitches = PATCHES['swing-jazz'].events.filter((event) => event.voice === 'bass');
    const swingChordTones: Record<number, Set<number>> = {
      0: new Set([2, 5, 9, 0]),
      4: new Set([7, 11, 2, 5]),
      8: new Set([0, 4, 7, 11]),
    };
    expect(swingBassPitches.every((event) => {
      const chordStart = event.step < 4 ? 0 : event.step < 8 ? 4 : 8;
      return event.midi !== undefined && swingChordTones[chordStart]!.has(event.midi % 12);
    })).toBe(true);
  });
});
