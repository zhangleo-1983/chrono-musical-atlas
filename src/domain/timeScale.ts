import { ERA_IDS, ERAS, PRESENT_YEAR } from './eras';
import type { EraId } from './types';

const SEGMENTS = ERA_IDS.length;

export function yearToT(year: number): number {
  const clamped = Math.max(ERAS.ancient.start, Math.min(PRESENT_YEAR, year));
  const eraIndex = ERA_IDS.findIndex((id) => clamped < ERAS[id].end);
  const index = eraIndex < 0 ? SEGMENTS - 1 : eraIndex;
  const era = ERAS[ERA_IDS[index]!];
  const end = Number.isFinite(era.end) ? era.end : PRESENT_YEAR;
  const local = end === era.start ? 0 : (clamped - era.start) / (end - era.start);
  return Math.max(0, Math.min(1, (index + Math.max(0, Math.min(1, local))) / SEGMENTS));
}

export function tToYear(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  const scaled = clamped * SEGMENTS;
  const index = Math.min(SEGMENTS - 1, Math.floor(scaled));
  const local = index === SEGMENTS - 1 && clamped === 1 ? 1 : scaled - index;
  const era = ERAS[ERA_IDS[index]!];
  const end = Number.isFinite(era.end) ? era.end : PRESENT_YEAR;
  return Math.round(era.start + (end - era.start) * local);
}

export function eraRangeT(era: EraId | 'all'): [number, number] {
  if (era === 'all') return [0, 1];
  const index = ERA_IDS.indexOf(era);
  return [index / SEGMENTS, (index + 1) / SEGMENTS];
}

export function formatYear(year: number): string {
  return year < 0 ? `公元前 ${Math.abs(year)} 年` : `公元 ${year} 年`;
}
