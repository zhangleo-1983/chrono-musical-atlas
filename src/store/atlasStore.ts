import { create } from 'zustand';
import { ERAS, PRESENT_YEAR } from '../domain/eras';
import type { ComparePreset, EraId, GenreId } from '../domain/types';
import { NODE_BY_ID } from '../data';

export interface AtlasState {
  era: EraId | 'all';
  year: number | null;
  genres: Set<GenreId>;
  showArcs: boolean;
  isPlaying: boolean;
  selectedId: string | null;
  hoveredId: string | null;
  focus: { id: string; nonce: number } | null;
  compare: [string | null, string | null];
  compareOpen: boolean;
  setEra: (era: EraId | 'all') => void;
  setYear: (year: number | null) => void;
  tickYear: (year: number) => void;
  toggleGenre: (genre: GenreId) => void;
  clearGenres: () => void;
  toggleArcs: () => void;
  togglePlay: () => void;
  selectNode: (id: string | null, options?: { reveal?: boolean; focus?: boolean }) => void;
  setHovered: (id: string | null) => void;
  addToCompare: (id: string) => void;
  removeFromCompare: (slot: 0 | 1) => void;
  loadPreset: (preset: ComparePreset) => void;
  setCompareOpen: (open: boolean) => void;
}

function windowBounds(era: EraId | 'all'): [number, number] {
  if (era === 'all') return [-1500, PRESENT_YEAR];
  const value = ERAS[era];
  return [value.start, Number.isFinite(value.end) ? value.end : PRESENT_YEAR];
}

export const useAtlasStore = create<AtlasState>((set, get) => ({
  era: 'all', year: null, genres: new Set<GenreId>(), showArcs: true,
  isPlaying: false, selectedId: null, hoveredId: null, focus: null,
  compare: [null, null], compareOpen: false,
  setEra: (era) => set({ era, year: null, isPlaying: false }),
  setYear: (year) => set({ year, isPlaying: false }),
  tickYear: (year) => set({ year }),
  toggleGenre: (genre) => set((state) => {
    const genres = new Set(state.genres);
    if (genres.has(genre)) genres.delete(genre); else genres.add(genre);
    return { genres };
  }),
  clearGenres: () => set({ genres: new Set<GenreId>() }),
  toggleArcs: () => set((state) => ({ showArcs: !state.showArcs })),
  togglePlay: () => set((state) => {
    if (state.isPlaying) return { isPlaying: false };
    const [, end] = windowBounds(state.era);
    const [start] = windowBounds(state.era);
    return state.year === null || state.year >= end ? { isPlaying: true, year: start } : { isPlaying: true };
  }),
  selectNode: (id, options = {}) => set((state) => {
    if (id !== null && !NODE_BY_ID.has(id)) return { selectedId: null };
    const reveal = options.reveal === true;
    const focus = options.focus === true;
    return {
      selectedId: id,
      ...(reveal ? { genres: new Set<GenreId>(), era: 'all' as const, year: null, isPlaying: false } : {}),
      ...(focus && id !== null ? { focus: { id, nonce: (state.focus?.nonce ?? 0) + 1 } } : {}),
    };
  }),
  setHovered: (id) => set({ hoveredId: id }),
  addToCompare: (id) => set((state) => {
    if (!NODE_BY_ID.has(id) || state.compare.includes(id)) return {};
    const [a, b] = state.compare;
    return a === null ? { compare: [id, b] } : b === null ? { compare: [a, id] } : { compare: [a, id] };
  }),
  removeFromCompare: (slot) => set((state) => {
    const compare: [string | null, string | null] = [...state.compare] as [string | null, string | null];
    compare[slot] = null;
    return { compare, compareOpen: false };
  }),
  loadPreset: (preset) => set({ compare: [preset.a, preset.b], compareOpen: false }),
  setCompareOpen: (open) => set((state) => ({ compareOpen: open && state.compare[0] !== null && state.compare[1] !== null })),
}));

export const atlasStore = useAtlasStore;
