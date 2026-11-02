import { create } from 'zustand';
import { ERAS, PRESENT_YEAR } from '../domain/eras';
import type { ComparePreset, EraId, GenreId } from '../domain/types';
import { NODE_BY_ID, ODYSSEYS } from '../data';

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
  odyssey: { routeId: string; index: number } | null;
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
  startOdyssey: (routeId: string) => void;
  gotoStop: (index: number) => void;
  nextStop: () => void;
  prevStop: () => void;
  exitOdyssey: () => void;
}

function windowBounds(era: EraId | 'all'): [number, number] {
  if (era === 'all') return [ERAS.ancient.start, PRESENT_YEAR];
  const value = ERAS[era];
  return [value.start, Number.isFinite(value.end) ? value.end : PRESENT_YEAR];
}

export const useAtlasStore = create<AtlasState>((set, get) => ({
  era: 'all', year: null, genres: new Set<GenreId>(), showArcs: true,
  isPlaying: false, selectedId: null, hoveredId: null, focus: null,
  compare: [null, null], compareOpen: false, odyssey: null,
  setEra: (era) => set({ era, year: null, isPlaying: false, odyssey: null }),
  setYear: (year) => set({ year, isPlaying: false, odyssey: null }),
  tickYear: (year) => set({ year }),
  toggleGenre: (genre) => set((state) => {
    const genres = new Set(state.genres);
    if (genres.has(genre)) genres.delete(genre); else genres.add(genre);
    return { genres, odyssey: null };
  }),
  clearGenres: () => set({ genres: new Set<GenreId>(), odyssey: null }),
  toggleArcs: () => set((state) => ({ showArcs: !state.showArcs })),
  togglePlay: () => set((state) => {
    if (state.isPlaying) return { isPlaying: false, odyssey: null };
    const [, end] = windowBounds(state.era);
    const [start] = windowBounds(state.era);
    return state.year === null || state.year >= end ? { isPlaying: true, year: start, odyssey: null } : { isPlaying: true, odyssey: null };
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
  startOdyssey: (routeId) => {
    const route = ODYSSEYS.find((candidate) => candidate.id === routeId);
    if (!route || route.stops.length === 0) return;
    get().selectNode(route.stops[0]!, { reveal: true, focus: true });
    set({ odyssey: { routeId, index: 0 } });
  },
  gotoStop: (index) => {
    const current = get().odyssey;
    if (!current) return;
    const route = ODYSSEYS.find((candidate) => candidate.id === current.routeId);
    if (!route || index < 0 || index >= route.stops.length) return;
    get().selectNode(route.stops[index]!, { reveal: true, focus: true });
    set({ odyssey: { routeId: current.routeId, index } });
  },
  nextStop: () => { const current = get().odyssey; if (current) get().gotoStop(current.index + 1); },
  prevStop: () => { const current = get().odyssey; if (current) get().gotoStop(current.index - 1); },
  exitOdyssey: () => set({ odyssey: null }),
}));

export const atlasStore = useAtlasStore;
