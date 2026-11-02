import { describe, expect, it } from 'vitest';
import { ERA_IDS } from '../domain/eras';
import { GENRES } from '../domain/genres';
import type { PatchId } from '../domain/types';
import { NODE_BY_ID, NODES, PRESETS } from './index';

describe('music dataset', () => {
  it('contains a connected, geographically valid MVP dataset', () => {
    expect(NODES.length).toBeGreaterThanOrEqual(18);
    expect(NODES.length).toBeLessThanOrEqual(24);
    expect(new Set(NODES.map((n) => n.id)).size).toBe(NODES.length);
    for (const era of ERA_IDS) expect(NODES.filter((n) => n.era === era).length).toBeGreaterThanOrEqual(2);
    for (const genre of GENRES) expect(NODES.filter((n) => n.genre === genre.id).length).toBeGreaterThanOrEqual(2);
    expect(new Set(NODES.map((n) => n.continent)).size).toBe(4);
    const patches = new Set<PatchId>(NODES.map((n) => n.patch));
    expect(patches.size).toBe(8);
    for (const node of NODES) {
      expect(node.lat).toBeGreaterThanOrEqual(-90); expect(node.lat).toBeLessThanOrEqual(90);
      expect(node.lon).toBeGreaterThanOrEqual(-180); expect(node.lon).toBeLessThanOrEqual(180);
      expect(node.endYear === null || node.endYear >= node.startYear).toBe(true);
      expect(node.musicians.length).toBeGreaterThanOrEqual(1);
      expect(node.works.length).toBeGreaterThanOrEqual(2);
      expect(node.instruments.length).toBeGreaterThanOrEqual(2);
      expect(node.traits.length).toBeGreaterThanOrEqual(2);
      expect(node.summary.length).toBeGreaterThanOrEqual(80);
      expect(node.summary.length).toBeLessThanOrEqual(160);
      for (const value of Object.values(node.radar)) expect(Number.isInteger(value) && value >= 0 && value <= 100).toBe(true);
      for (const parentId of node.influencedBy) {
        const parent = NODE_BY_ID.get(parentId);
        expect(parent).toBeDefined();
        expect(parent!.startYear).toBeLessThan(node.startYear);
      }
      for (const childId of node.influences) expect(NODE_BY_ID.get(childId)?.influencedBy).toContain(node.id);
    }
    for (const preset of PRESETS) {
      expect(NODE_BY_ID.has(preset.a)).toBe(true); expect(NODE_BY_ID.has(preset.b)).toBe(true); expect(preset.a).not.toBe(preset.b);
    }
  });
});
