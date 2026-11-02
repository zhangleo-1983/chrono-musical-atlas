import { describe, expect, it } from 'vitest';
import { NODE_BY_ID, NODES } from '../data';
import { PATCHES } from '../audio/patches';
import type { PatchId } from '../domain/types';
import { commonsSearchUrl, figureFor, PATCH_FIGURE } from './figures';

describe('museum figure mapping', () => {
  it('maps all patches and respects node-specific figures', () => {
    for (const patch of Object.keys(PATCHES) as PatchId[]) expect(PATCH_FIGURE[patch]).toBeDefined();
    expect(figureFor(NODE_BY_ID.get('gamelan')!)).toBe('bells');
    expect(new Set(NODES.map((node) => figureFor(node))).size).toBeGreaterThanOrEqual(4);
  });

  it('encodes Commons image searches and falls back to the English name', () => {
    expect(commonsSearchUrl({ imageQuery: '贾湖 骨笛', nameEn: 'Jiahu Bone Flute' })).toContain(encodeURIComponent('贾湖 骨笛'));
    expect(commonsSearchUrl({ nameEn: 'Ancient Greek music' })).toContain(encodeURIComponent('Ancient Greek music'));
  });
});
