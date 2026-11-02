import { beforeEach, describe, expect, it } from 'vitest';
import { PRESETS } from '../data';
import { useAtlasStore } from './atlasStore';

beforeEach(() => {
  useAtlasStore.setState({ era: 'all', year: null, genres: new Set(), showArcs: true, isPlaying: false, selectedId: null, hoveredId: null, focus: null, compare: [null, null], compareOpen: false });
});

describe('atlas store', () => {
  it('reveals and focuses nodes while resetting filters', () => {
    const store = useAtlasStore.getState();
    store.toggleGenre('classical'); store.setEra('baroque'); store.setYear(1700);
    store.selectNode('tokyo-electro', { reveal: true, focus: true });
    const state = useAtlasStore.getState();
    expect(state.selectedId).toBe('tokyo-electro'); expect(state.era).toBe('all'); expect(state.year).toBeNull(); expect(state.genres.size).toBe(0); expect(state.isPlaying).toBe(false); expect(state.focus?.id).toBe('tokyo-electro');
  });
  it('fills comparison slots, then replaces B, and closes when incomplete', () => {
    const store = useAtlasStore.getState();
    store.addToCompare('zhou-ritual'); store.addToCompare('paris-impressionism');
    expect(useAtlasStore.getState().compare).toEqual(['zhou-ritual', 'paris-impressionism']);
    store.addToCompare('detroit-techno');
    expect(useAtlasStore.getState().compare).toEqual(['zhou-ritual', 'detroit-techno']);
    store.setCompareOpen(true); expect(useAtlasStore.getState().compareOpen).toBe(true);
    store.removeFromCompare(0); expect(useAtlasStore.getState().compareOpen).toBe(false); expect(useAtlasStore.getState().compare[0]).toBeNull();
  });
  it('ignores duplicate and incomplete modal opens', () => {
    const store = useAtlasStore.getState();
    store.addToCompare('zhou-ritual'); store.addToCompare('zhou-ritual'); store.setCompareOpen(true);
    expect(useAtlasStore.getState().compare).toEqual(['zhou-ritual', null]); expect(useAtlasStore.getState().compareOpen).toBe(false);
  });
  it('loads presets and starts a stopped timeline from its window start', () => {
    const store = useAtlasStore.getState(); store.loadPreset(PRESETS[0]!); expect(useAtlasStore.getState().compare).toEqual([PRESETS[0]!.a, PRESETS[0]!.b]);
    store.setEra('contemporary'); store.togglePlay();
    expect(useAtlasStore.getState().year).toBe(1970); expect(useAtlasStore.getState().isPlaying).toBe(true);
    store.setEra('modern'); store.setYear(1970); store.togglePlay(); expect(useAtlasStore.getState().isPlaying).toBe(true);
  });
});
