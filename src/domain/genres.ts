import type { GenreId } from './types';

export const GENRES: { id: GenreId; label: string; color: string }[] = [
  { id: 'ritual', label: '古文明礼乐', color: '#FFB547' },
  { id: 'classical', label: '古典艺术音乐', color: '#A77BFF' },
  { id: 'folk', label: '民间与民族音乐', color: '#2EE6A6' },
  { id: 'blues_jazz', label: '蓝调与爵士', color: '#3F8CFF' },
  { id: 'rock_pop', label: '摇滚与流行', color: '#FF4D5E' },
  { id: 'electronic', label: '电子与先锋', color: '#22E6F0' },
];
export const GENRE_LABELS: Record<GenreId, string> = Object.fromEntries(GENRES.map((g) => [g.id, g.label])) as Record<GenreId, string>;
export const GENRE_COLORS: Record<GenreId, string> = Object.fromEntries(GENRES.map((g) => [g.id, g.color])) as Record<GenreId, string>;
