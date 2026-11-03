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
      expect(node.repertoire.length).toBeGreaterThanOrEqual(1);
      expect(node.repertoire.length).toBeLessThanOrEqual(3);
      expect(Boolean(node.notation) !== Boolean(node.notationAbsentNote)).toBe(true);
      if (node.notation) {
        expect(node.notation.system.length).toBeGreaterThan(0);
        expect(node.notation.eraNote.length).toBeGreaterThan(0);
        expect(node.notation.source.length).toBeGreaterThan(0);
        expect(node.notation.referenceKey.length).toBeGreaterThan(0);
        expect(node.notation.glyphs.length).toBeGreaterThanOrEqual(4);
        expect(node.notation.glyphs.length).toBeLessThanOrEqual(6);
        for (const glyph of node.notation.glyphs) {
          expect(glyph.symbol.length).toBeGreaterThan(0);
          expect(glyph.modern.length).toBeGreaterThan(0);
          expect(glyph.meaning.length).toBeGreaterThan(0);
          for (const midi of Array.isArray(glyph.midi) ? glyph.midi : [glyph.midi]) expect(midi).toBeGreaterThanOrEqual(36);
          for (const midi of Array.isArray(glyph.midi) ? glyph.midi : [glyph.midi]) expect(midi).toBeLessThanOrEqual(96);
        }
      } else expect(node.notationAbsentNote).toBeTruthy();
      expect(new Set(node.repertoire.map((work) => work.id)).size).toBe(node.repertoire.length);
      expect(new Set(node.repertoire.map((work) => work.guide)).size).toBe(node.repertoire.length);
      const motifSequences = new Set<string>();
      for (const work of node.repertoire) {
        expect(node.works).toContain(work.title);
        expect(work.guide.length).toBeGreaterThanOrEqual(50);
        expect(work.guide.length).toBeLessThanOrEqual(100);
        expect(work.guide).not.toBe(node.summary);
        expect(work.guide).not.toBe(node.story);
        expect(work.title.length).toBeGreaterThan(0);
        expect(work.subtitle.length).toBeGreaterThan(0);
        expect(work.searchQuery).toContain(work.title);
        expect(work.pdBasis.length).toBeGreaterThan(0);
        if (!work.publicDomain) expect(work.motif).toBeUndefined();
        if (work.motif) {
          expect(work.motifKind).toBeDefined();
          const sequence = work.motif.events.flatMap((event) => Array.isArray(event.midi) ? event.midi : [event.midi]);
          const signature = sequence.join(',');
          expect(motifSequences.has(signature)).toBe(false);
          motifSequences.add(signature);
        }
        if (work.motifKind === 'theme') expect(work.motifSource).toBeTruthy();
      }
      for (const value of Object.values(node.radar)) expect(Number.isInteger(value) && value >= 0 && value <= 100).toBe(true);
      for (const parentId of node.influencedBy) {
        const parent = NODE_BY_ID.get(parentId);
        expect(parent).toBeDefined();
        expect(parent!.startYear).toBeLessThan(node.startYear);
      }
      for (const childId of node.influences) expect(NODE_BY_ID.get(childId)?.influencedBy).toContain(node.id);
    }
    expect(NODES.filter((node) => node.notation).length).toBe(6);
    for (const id of ['sumer-lyre', 'hurrian-hymn', 'greek-modes', 'persian-silkroad']) {
      expect(NODE_BY_ID.get(id)?.notation).toBeUndefined();
      expect(NODE_BY_ID.get(id)?.notationAbsentNote).toBeTruthy();
    }
    const forbiddenSymbols = new Set(['低位', '终止', '应答', '多利亚', '弗里吉亚', '五旦', '七调', '龟兹']);
    for (const node of NODES) {
      for (const glyph of node.notation?.glyphs ?? []) expect(forbiddenSymbols.has(glyph.symbol)).toBe(false);
    }
    for (const id of ['jiahu-flute', 'egypt-temple', 'andean-chavin', 'maya-ritual']) {
      expect(NODE_BY_ID.get(id)?.notation).toBeUndefined();
      expect(NODE_BY_ID.get(id)?.notationAbsentNote).toBeTruthy();
    }
    for (const node of NODES.filter((candidate) => ['blues_jazz', 'rock_pop', 'electronic'].includes(candidate.genre))) {
      expect(node.repertoire.every((work) => !work.publicDomain)).toBe(true);
    }
    const themes = NODES.flatMap((node) => node.repertoire.filter((work) => work.motifKind === 'theme').map((work) => `${node.id}:${work.title}`));
    expect(themes.sort()).toEqual(['leipzig-baroque:《平均律键盘曲集》', 'vienna-classical:《月光奏鸣曲》', 'vienna-classical:《第五交响曲》']);
    const fifth = NODE_BY_ID.get('vienna-classical')!.repertoire.find((work) => work.title === '《第五交响曲》')!;
    const moonlight = NODE_BY_ID.get('vienna-classical')!.repertoire.find((work) => work.title === '《月光奏鸣曲》')!;
    const bach = NODE_BY_ID.get('leipzig-baroque')!.repertoire.find((work) => work.title === '《平均律键盘曲集》')!;
    expect(fifth.motif?.voice).toBe('strings'); expect(fifth.motif?.wet).toBe(0.22);
    expect(fifth.motif?.events.map((event) => event.midi)).toEqual([[55, 67], [55, 67], [55, 67], [51, 63], [53, 65], [53, 65], [53, 65], [50, 62]]);
    expect(moonlight.motif?.voice).toBe('piano'); expect(moonlight.motif?.wet).toBe(0.22);
    expect(bach.motif?.voice).toBe('harpsichord'); expect(bach.motif?.wet).toBe(0.22);
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
