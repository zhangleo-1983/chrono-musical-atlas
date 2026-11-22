import { describe, expect, it } from 'vitest';
import { NODE_BY_ID, NODES } from '../data';
import { PATCHES } from '../audio/patches';
import type { PatchId } from '../domain/types';
import { figureFor, FIGURE_CAPTIONS, PATCH_FIGURE } from './figures';

describe('museum figure mapping', () => {
  it('maps all patches and respects node-specific figures', () => {
    for (const patch of Object.keys(PATCHES) as PatchId[]) expect(PATCH_FIGURE[patch]).toBeDefined();
    expect(figureFor(NODE_BY_ID.get('gamelan')!)).toBe('bells');
    expect(figureFor(NODE_BY_ID.get('notre-dame-polyphony')!)).toBe('voices');
    expect(FIGURE_CAPTIONS.voices.length).toBeGreaterThan(0);
    expect(new Set(NODES.map((node) => figureFor(node))).size).toBeGreaterThanOrEqual(4);
  });
});
