import type { EraId } from './types';

export const PRESENT_YEAR = 2026;
export const ERA_IDS: EraId[] = ['ancient', 'medieval', 'baroque', 'romantic', 'modern', 'contemporary'];
export const ERAS: Record<EraId, { id: EraId; label: string; start: number; end: number }> = {
  ancient: { id: 'ancient', label: '远古-500 AD', start: -1500, end: 500 },
  medieval: { id: 'medieval', label: '中世纪与文艺复兴 (500-1600)', start: 500, end: 1600 },
  baroque: { id: 'baroque', label: '巴洛克与古典 (1600-1820)', start: 1600, end: 1820 },
  romantic: { id: 'romantic', label: '浪漫与民族 (1820-1910)', start: 1820, end: 1910 },
  modern: { id: 'modern', label: '现代爵士与摇滚 (1910-1970)', start: 1910, end: 1970 },
  contemporary: { id: 'contemporary', label: '当代多元与电子 (1970-至今)', start: 1970, end: Infinity },
};

export function eraOf(year: number): EraId {
  if (year < 500) return 'ancient';
  if (year < 1600) return 'medieval';
  if (year < 1820) return 'baroque';
  if (year < 1910) return 'romantic';
  if (year < 1970) return 'modern';
  return 'contemporary';
}
