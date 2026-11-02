import type { PatchId } from '../domain/types';

export type Voice = 'pluck' | 'drone' | 'harpsichord' | 'strings' | 'epiano' | 'bass' | 'distGuitar' | 'synthPulse' | 'kick' | 'snare' | 'hat' | 'djembeLow' | 'djembeHigh' | 'bell';
export interface NoteEvent { step: number; voice: Voice; midi?: number; durSteps: number; vel: number }
export interface Patch { id: PatchId; label: string; bpm: number; stepsPerBeat: number; swing: number; bars: number; beatsPerBar: number; events: NoteEvent[] }

const note = (step: number, voice: Voice, midi: number | undefined, durSteps: number, vel: number): NoteEvent => ({ step, voice, ...(midi === undefined ? {} : { midi }), durSteps, vel });
const cycle = (patch: Patch): number => patch.bars * patch.beatsPerBar * patch.stepsPerBeat;

const pentatonic: Patch = {
  id: 'pentatonic-pluck', label: '宫调五声拨弦', bpm: 66, stepsPerBeat: 4, swing: 0, bars: 2, beatsPerBar: 4,
  events: [0, 4, 8, 12, 16, 20, 24, 28].map((step, i) => note(step, 'pluck', [60, 62, 64, 67, 69][i % 5], 2, 0.68)),
};
const modalDrone: Patch = {
  id: 'modal-drone', label: '弗里吉亚长音', bpm: 52, stepsPerBeat: 2, swing: 0, bars: 2, beatsPerBar: 4,
  events: [0, 4, 8, 12].flatMap((step, i) => [note(step, 'drone', 50, 8, 0.42), note(step + 1, 'drone', [62, 63, 65, 67][i], 2, 0.48)]),
};
const polyrhythm: Patch = {
  id: 'polyrhythm-drums', label: '三对二鼓阵', bpm: 110, stepsPerBeat: 3, swing: 0, bars: 2, beatsPerBar: 4,
  events: [0, 3, 6, 9, 12, 15, 18, 21].map((step) => note(step, 'djembeLow', undefined, 1, 0.82))
    .concat([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22].map((step) => note(step, 'djembeHigh', undefined, 1, 0.65)))
    .concat([1, 4, 7, 10, 13, 16, 19, 22].map((step) => note(step, 'bell', 84, 1, 0.55))),
};
const baroque: Patch = {
  id: 'baroque-harpsichord', label: '巴洛克模仿复调', bpm: 104, stepsPerBeat: 4, swing: 0, bars: 2, beatsPerBar: 4,
  events: Array.from({ length: 32 }, (_, step) => note(step, 'harpsichord', [69, 72, 76, 77, 76, 72, 69, 67][step % 8], 1, 0.5))
    .concat(Array.from({ length: 16 }, (_, step) => note(step + 16, 'harpsichord', [57, 60, 64, 65, 64, 60, 57, 55][step % 8], 1, 0.42)))
    .concat([0, 8, 16, 24].map((step) => note(step, 'bass', [45, 40, 43, 45][step / 8]!, 4, 0.55))),
};
const classical: Patch = {
  id: 'classical-strings', label: '古典主义弦乐', bpm: 92, stepsPerBeat: 2, swing: 0, bars: 2, beatsPerBar: 4,
  events: [0, 4, 8, 12].flatMap((step, i) => {
    const chords = [[60, 64, 67, 72], [65, 69, 72, 77], [67, 71, 74, 79], [60, 64, 67, 72]];
    const alberti = [[36, 43, 40, 43], [41, 48, 45, 48], [43, 50, 47, 50], [36, 43, 40, 43]];
    return chords[i]!.map((midi) => note(step, 'strings', midi, 4, 0.38)).concat(alberti[i]!.map((midi, index) => note(step + index, 'bass', midi, 1, 0.36)));
  }),
};
const swing: Patch = {
  id: 'swing-jazz', label: '摇摆爵士七和弦', bpm: 132, stepsPerBeat: 2, swing: 0.6, bars: 2, beatsPerBar: 4,
  events: [0, 4, 8, 12].flatMap((step, i) => {
    const chords = [[62, 65, 69, 72], [67, 71, 74, 77], [60, 64, 67, 71], [60, 64, 67, 71]];
    return chords[i]!.map((midi) => note(step, 'epiano', midi, 4, 0.32));
  }).concat([0, 2, 4, 6, 8, 10, 12, 14].map((step, i) => note(step, 'bass', [38, 41, 43, 47, 36, 40, 43, 47][i], 1, 0.55)))
    .concat([1, 3, 5, 7, 9, 11, 13, 15].map((step) => note(step, 'hat', undefined, 1, 0.35))),
};
const rock: Patch = {
  id: 'rock-distortion', label: 'E 强力和弦摇滚', bpm: 130, stepsPerBeat: 4, swing: 0, bars: 2, beatsPerBar: 4,
  events: [0, 4, 8, 12, 16, 20, 24, 28].flatMap((step, i) => [40, 47, 52].map((midi) => note(step, 'distGuitar', midi + ([0, 0, 3, 0, 7, 3, 0, 7][i] ?? 0), 3, 0.52)))
    .concat([0, 8, 16, 24].map((step) => note(step, 'kick', undefined, 1, 0.9)))
    .concat([4, 12, 20, 28].map((step) => note(step, 'snare', undefined, 1, 0.75))),
};
const electro: Patch = {
  id: 'electro-pulse', label: '四踩电子脉冲', bpm: 128, stepsPerBeat: 4, swing: 0, bars: 2, beatsPerBar: 4,
  events: [0, 4, 8, 12, 16, 20, 24, 28].map((step) => note(step, 'kick', undefined, 1, 0.85))
    .concat(Array.from({ length: 32 }, (_, step) => note(step, 'synthPulse', [72, 76, 79, 84][step % 4], 1, 0.4)))
    .concat([2, 6, 10, 14, 18, 22, 26, 30].map((step) => note(step, 'hat', undefined, 1, 0.4))),
};

export const PATCHES: Record<PatchId, Patch> = {
  'pentatonic-pluck': pentatonic, 'modal-drone': modalDrone, 'polyrhythm-drums': polyrhythm, 'baroque-harpsichord': baroque,
  'classical-strings': classical, 'swing-jazz': swing, 'rock-distortion': rock, 'electro-pulse': electro,
};

export function stepTime(step: number, patch: Patch): number {
  const beatSeconds = 60 / patch.bpm;
  const base = step * beatSeconds / patch.stepsPerBeat;
  const swingDelay = patch.swing === 0 || step % 2 === 0 ? 0 : patch.swing * beatSeconds * 0.5;
  return base + swingDelay;
}

export { cycle as patchCycleLength };
