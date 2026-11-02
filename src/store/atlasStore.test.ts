import { beforeEach, describe, expect, it } from 'vitest';
import { NODES, ODYSSEYS, PRESETS } from '../data';
import { useAtlasStore } from './atlasStore';

beforeEach(() => {
  useAtlasStore.setState({ era: 'all', year: null, genres: new Set(), showArcs: true, isPlaying: false, selectedId: null, hoveredId: null, focus: null, compare: [null, null], compareOpen: false, odyssey: null });
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
  it('starts the all-history timeline at the ancient era start', () => {
    const store = useAtlasStore.getState();
    store.togglePlay();
    expect(useAtlasStore.getState().year).toBe(-7000);
    expect(useAtlasStore.getState().isPlaying).toBe(true);
  });
  it('keeps odyssey routes chronological and supports bounded navigation', () => {
    for (const route of ODYSSEYS) {
      expect(route.stops.length).toBeGreaterThanOrEqual(2);
      const years = route.stops.map((id) => NODES.find((node) => node.id === id)!.startYear);
      expect(years.every((year, index) => index === 0 || year > years[index - 1]!)).toBe(true);
    }
    const store = useAtlasStore.getState();
    store.startOdyssey(ODYSSEYS[0]!.id);
    const started = useAtlasStore.getState();
    expect(started.odyssey).toEqual({ routeId: ODYSSEYS[0]!.id, index: 0 });
    expect(started.selectedId).toBe(ODYSSEYS[0]!.stops[0]);
    expect(started.genres.size).toBe(0);
    const nonce = started.focus!.nonce;
    store.prevStop();
    expect(useAtlasStore.getState().odyssey?.index).toBe(0);
    store.nextStop();
    expect(useAtlasStore.getState().odyssey?.index).toBe(1);
    store.gotoStop(ODYSSEYS[0]!.stops.length - 1);
    store.nextStop();
    expect(useAtlasStore.getState().odyssey?.index).toBe(ODYSSEYS[0]!.stops.length - 1);
    expect(useAtlasStore.getState().focus!.nonce).toBeGreaterThan(nonce);
    store.exitOdyssey();
    expect(useAtlasStore.getState().odyssey).toBeNull();
    expect(useAtlasStore.getState().selectedId).toBe(ODYSSEYS[0]!.stops[ODYSSEYS[0]!.stops.length - 1]);
  });
  it('exits odyssey on user filters but not on playback ticks', () => {
    const store = useAtlasStore.getState();
    store.startOdyssey(ODYSSEYS[1]!.id);
    store.tickYear(-1200);
    expect(useAtlasStore.getState().odyssey).not.toBeNull();
    store.setEra('modern');
    expect(useAtlasStore.getState().odyssey).toBeNull();
    store.startOdyssey(ODYSSEYS[1]!.id);
    store.toggleGenre('ritual');
    expect(useAtlasStore.getState().odyssey).toBeNull();
    store.startOdyssey(ODYSSEYS[1]!.id);
    store.togglePlay();
    expect(useAtlasStore.getState().odyssey).toBeNull();
  });
});
