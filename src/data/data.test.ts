import { describe, expect, it } from 'vitest';
import { ERA_IDS } from '../domain/eras';
import { GENRES } from '../domain/genres';
import type { PatchId } from '../domain/types';
import { PATCHES } from '../audio/patches';
import { NODE_BY_ID, NODES, ODYSSEYS, PRESETS } from './index';

describe('music dataset', () => {
  it('contains a connected, geographically valid MVP dataset', () => {
    expect(NODES).toHaveLength(34);
    expect(new Set(NODES.filter((n) => n.era === 'ancient').map((n) => n.id))).toEqual(new Set([
      'jiahu-flute', 'sumer-lyre', 'egypt-temple', 'hurrian-hymn', 'andean-chavin', 'zenghouyi-bells',
      'persian-silkroad', 'roman-hydraulis', 'vedic-chant', 'zhou-ritual', 'greek-modes', 'han-wei-yuefu',
      'hebrew-temple', 'maya-ritual',
    ]));
    expect(new Set(NODES.map((n) => n.id)).size).toBe(NODES.length);
    expect(new Set(NODES.map((n) => `${n.lat},${n.lon}`)).size).toBe(NODES.length);
    for (const era of ERA_IDS) expect(NODES.filter((n) => n.era === era).length).toBeGreaterThanOrEqual(2);
    for (const genre of GENRES) expect(NODES.filter((n) => n.genre === genre.id).length).toBeGreaterThanOrEqual(2);
    expect(new Set(NODES.map((n) => n.continent)).size).toBe(4);
    const patches = new Set<PatchId>(NODES.map((n) => n.patch));
    expect(patches.size).toBe(13);
    expect([...patches].every((patch) => PATCHES[patch] !== undefined)).toBe(true);
    for (const node of NODES) {
      expect(node.lat).toBeGreaterThanOrEqual(-90); expect(node.lat).toBeLessThanOrEqual(90);
      expect(node.lon).toBeGreaterThanOrEqual(-180); expect(node.lon).toBeLessThanOrEqual(180);
      expect(node.endYear === null || node.endYear >= node.startYear).toBe(true);
      expect(node.musicians.length).toBeGreaterThanOrEqual(1);
      expect(node.works.length).toBeGreaterThanOrEqual(2);
      expect(node.instruments.length).toBeGreaterThanOrEqual(2);
      expect(node.traits.length).toBeGreaterThanOrEqual(2);
      expect(node.artifact.length).toBeGreaterThan(0);
      expect(node.tuningSystem.length).toBeGreaterThan(0);
      expect(node.institution.length).toBeGreaterThan(0);
      expect(node.treatises.length).toBeGreaterThanOrEqual(2);
      expect(node.story.length).toBeGreaterThanOrEqual(80);
      expect(node.story.length).toBeLessThanOrEqual(220);
      expect(node.story).not.toBe(node.summary);
      expect(node.treatises.some((treatise) => node.works.includes(treatise))).toBe(false);
      expect(node.institution.startsWith(`${node.region}的`)).toBe(false);
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
    const ancient = NODES.filter((node) => node.era === 'ancient');
    for (const node of ancient) {
      expect(node.musicians.length).toBeGreaterThanOrEqual(2);
      expect(new Set(node.musicians.map((musician) => musician.name)).size).toBe(node.musicians.length);
    }
    for (const preset of PRESETS) {
      expect(NODE_BY_ID.has(preset.a)).toBe(true); expect(NODE_BY_ID.has(preset.b)).toBe(true); expect(preset.a).not.toBe(preset.b);
    }
    expect(PRESETS).toHaveLength(7);
    expect(ODYSSEYS).toHaveLength(3);
    expect(ODYSSEYS.map((route) => route.stops.length)).toEqual([5, 7, 6]);
    for (const route of ODYSSEYS) {
      for (let index = 0; index < route.stops.length; index += 1) {
        const node = NODE_BY_ID.get(route.stops[index]!);
        expect(node).toBeDefined();
        if (index > 0) expect(NODE_BY_ID.get(route.stops[index - 1]!)!.startYear).toBeLessThan(node!.startYear);
      }
    }
  });
});
