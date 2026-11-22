/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest';
import { ERA_IDS } from '../domain/eras';
import { GENRES } from '../domain/genres';
import type { PatchId } from '../domain/types';
import { PATCHES } from '../audio/patches';
import { NODE_BY_ID, NODES, ODYSSEYS, PRESETS } from './index';

function sharesRun(a: string, b: string, minimum: number): boolean {
  for (let start = 0; start <= a.length - minimum; start += 1) {
    if (b.includes(a.slice(start, start + minimum))) return true;
  }
  return false;
}

const ALLOWED_EXCERPTS = new Map([
  ['zhou-ritual:《乐记》', '凡音之起，由人心生也。人心之动，物使之然也。感于物而动，故形于声。'],
  ['zhou-ritual:《荀子·乐论》', '夫乐者，乐也，人情之所必不免也。'],
  ['han-wei-yuefu:《乐记》', '乐者，天地之和也；礼者，天地之序也。'],
  ['han-wei-yuefu:《声无哀乐论》', '然则心之与声，明为二物。'],
  ['persian-silkroad:《隋书·音乐志》', '有龟兹人曰苏祗婆，从突厥皇后入国，善胡琵琶。'],
]);

describe('music dataset', () => {
  it('contains a connected, geographically valid MVP dataset', () => {
    expect(NODES).toHaveLength(40);
    expect(new Set(NODES.filter((n) => n.era === 'ancient').map((n) => n.id))).toEqual(new Set([
      'jiahu-flute', 'sumer-lyre', 'egypt-temple', 'hurrian-hymn', 'andean-chavin', 'zenghouyi-bells',
      'persian-silkroad', 'roman-hydraulis', 'vedic-chant', 'zhou-ritual', 'greek-modes', 'han-wei-yuefu',
      'hebrew-temple', 'maya-ritual',
    ]));
    expect(new Set(NODES.filter((n) => n.era === 'medieval').map((n) => n.id))).toEqual(new Set([
      'gagaku', 'baghdad-maqam', 'gregorian-chant', 'griot-mali', 'hindustani',
      'tang-changan', 'andalus-cordoba', 'notre-dame-polyphony', 'suzhou-kunqu', 'renaissance-polyphony', 'aztec-tenochtitlan',
    ]));
    expect(new Set(NODES.map((n) => n.id)).size).toBe(NODES.length);
    expect(new Set(NODES.map((n) => `${n.lat},${n.lon}`)).size).toBe(NODES.length);
    for (const era of ERA_IDS) expect(NODES.filter((n) => n.era === era).length).toBeGreaterThanOrEqual(2);
    for (const genre of GENRES) expect(NODES.filter((n) => n.genre === genre.id).length).toBeGreaterThanOrEqual(2);
    expect(new Set(NODES.map((n) => n.continent)).size).toBe(4);
    const patches = new Set<PatchId>(NODES.map((n) => n.patch));
    expect(patches.size).toBe(16);
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
      expect(node.treatiseList.map((treatise) => treatise.title)).toEqual(node.treatises);
      expect(new Set(node.treatiseList.map((treatise) => treatise.id)).size).toBe(node.treatiseList.length);
      for (const treatise of node.treatiseList) {
        expect(treatise.digest.length).toBeGreaterThanOrEqual(50);
        expect(treatise.digest.length).toBeLessThanOrEqual(110);
        expect(Boolean(treatise.excerpt) !== Boolean(treatise.keyPoint)).toBe(true);
        expect(Boolean(treatise.excerpt) === Boolean(treatise.excerptSource)).toBe(true);
        if (treatise.excerpt) expect(ALLOWED_EXCERPTS.get(`${node.id}:${treatise.title}`)).toBe(treatise.excerpt);
      }
      expect(node.story.length).toBeGreaterThanOrEqual(80);
      expect(node.story.length).toBeLessThanOrEqual(220);
      expect(node.story).not.toBe(node.summary);
      for (const musician of node.musicians) {
        expect(musician.bio.length).toBeGreaterThanOrEqual(60);
        expect(musician.bio.length).toBeLessThanOrEqual(140);
        expect(musician.legacy.length).toBeGreaterThanOrEqual(15);
        expect(musician.legacy.length).toBeLessThanOrEqual(50);
        expect(musician.legacy).not.toContain(musician.knownFor);
        for (const source of [node.summary, node.story, node.institution, node.artifact]) expect(sharesRun(musician.bio, source, 12)).toBe(false);
        expect(musician.bio).not.toContain('姑洗之宫，曾之大族');
        expect(musician.legacy).not.toContain('姑洗之宫，曾之大族');
      }
      for (const treatise of node.treatiseList) {
        expect(treatise.digest).not.toContain('姑洗之宫，曾之大族');
        expect(treatise.keyPoint ?? '').not.toContain('姑洗之宫，曾之大族');
        expect(treatise.excerpt ?? '').not.toContain('姑洗之宫，曾之大族');
      }
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
        // C2：工尺谱保留低八度合、四、一，才能闭合八度关系。
        expect(node.notation.glyphs.length).toBeLessThanOrEqual(8);
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
    // R1：旧人名/旧标题的回归网。只扫 NODES。
    // 不要扩大范围去扫 ai-workflow/04-*.md——那里保留着「修复前写法」作对照，扫它必红。
    const corpus = JSON.stringify(NODES);
    for (const stale of ['苏帕迪', '伊本·米斯贾赫', '传统雅乐笙', '《左传》伶州鸠论律']) {
      expect(corpus).not.toContain(stale);
    }
    expect(NODES.filter((node) => node.notation).length).toBe(8);
    for (const id of ['sumer-lyre', 'hurrian-hymn', 'greek-modes', 'persian-silkroad']) {
      expect(NODE_BY_ID.get(id)?.notation).toBeUndefined();
      expect(NODE_BY_ID.get(id)?.notationAbsentNote).toBeTruthy();
    }
    const forbiddenSymbols = new Set(['低位', '终止', '应答', '多利亚', '弗里吉亚', '五旦', '七调', '龟兹']);
    for (const node of NODES) {
      for (const glyph of node.notation?.glyphs ?? []) expect(forbiddenSymbols.has(glyph.symbol)).toBe(false);
    }
    for (const id of ['jiahu-flute', 'egypt-temple', 'andean-chavin', 'maya-ritual', 'tang-changan', 'andalus-cordoba', 'renaissance-polyphony', 'aztec-tenochtitlan']) {
      expect(NODE_BY_ID.get(id)?.notation).toBeUndefined();
      expect(NODE_BY_ID.get(id)?.notationAbsentNote).toBeTruthy();
    }
    for (const node of NODES.filter((candidate) => ['blues_jazz', 'rock_pop', 'electronic'].includes(candidate.genre))) {
      expect(node.repertoire.every((work) => !work.publicDomain)).toBe(true);
    }
    const musicians = NODES.flatMap((node) => node.musicians);
    expect(musicians).toHaveLength(67);
    expect(new Set(musicians.map((musician) => musician.bio)).size).toBe(musicians.length);
    const bios = musicians.map((musician) => musician.bio);
    for (let leftIndex = 0; leftIndex < bios.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < bios.length; rightIndex += 1) {
        expect(sharesRun(bios[leftIndex]!, bios[rightIndex]!, 12)).toBe(false);
      }
    }
    const legacies = musicians.map((musician) => musician.legacy);
    for (let leftIndex = 0; leftIndex < legacies.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < legacies.length; rightIndex += 1) {
        expect(sharesRun(legacies[leftIndex]!, legacies[rightIndex]!, 10)).toBe(false);
      }
    }
    const proseSources = Object.values(import.meta.glob(['./people.ts', './treatises.ts'], { eager: true, query: '?raw', import: 'default' })) as string[];
    for (const source of proseSources) {
      expect(source).not.toMatch(/\bfunction\b/);
      expect(source).not.toContain('=>');
      expect(source).not.toContain('`');
    }
    const roundSevenBios = NODES.filter((node) => ['tang-changan', 'andalus-cordoba', 'notre-dame-polyphony', 'suzhou-kunqu', 'renaissance-polyphony', 'aztec-tenochtitlan'].includes(node.id)).flatMap((node) => node.musicians.map((musician) => musician.bio));
    for (const bio of roundSevenBios) expect(bio).toMatch(/(\d{1,2}\s*世纪|\d{3,4}\s*年|《[^》]+》)/);
    expect(NODES.flatMap((node) => node.treatiseList)).toHaveLength(82);
    const treatises = NODES.flatMap((node) => node.treatiseList);
    const digests = treatises.map((treatise) => treatise.digest);
    for (let leftIndex = 0; leftIndex < digests.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < digests.length; rightIndex += 1) {
        expect(sharesRun(digests[leftIndex]!, digests[rightIndex]!, 12)).toBe(false);
      }
    }
    const keyPoints = treatises.flatMap((treatise) => treatise.keyPoint ? [treatise.keyPoint] : []);
    for (let leftIndex = 0; leftIndex < keyPoints.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < keyPoints.length; rightIndex += 1) {
        expect(sharesRun(keyPoints[leftIndex]!, keyPoints[rightIndex]!, 12)).toBe(false);
      }
    }
    const forbiddenBoilerplate = [
      '形成了可追踪的实践线索',
      '成为研究相关传统时的重要参照',
      '为理解当时的音乐实践提供线索',
      '待考',
      '尚待新材料',
      '彼此相连',
      '补足了现场细节',
      '第一条线索',
      '共同标出',
    ];
    for (const text of [...bios, ...legacies, ...digests, ...keyPoints]) {
      for (const phrase of forbiddenBoilerplate) expect(text).not.toContain(phrase);
    }
    const themes = NODES.flatMap((node) => node.repertoire.filter((work) => work.motifKind === 'theme').map((work) => `${node.id}:${work.title}`));
    expect(themes.sort()).toEqual(['leipzig-baroque:《平均律键盘曲集》', 'renaissance-polyphony:《圣母颂》', 'vienna-classical:《月光奏鸣曲》', 'vienna-classical:《第五交响曲》']);
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
    expect(PRESETS).toHaveLength(9);
    expect(ODYSSEYS).toHaveLength(4);
    expect(ODYSSEYS.map((route) => route.stops.length)).toEqual([5, 7, 8, 7]);
    for (const id of ['tang-changan', 'andalus-cordoba', 'notre-dame-polyphony', 'suzhou-kunqu', 'renaissance-polyphony', 'aztec-tenochtitlan']) {
      const node = NODE_BY_ID.get(id)!;
      expect(node.musicians.length).toBeGreaterThanOrEqual(2);
      expect(node.repertoire.length).toBeGreaterThanOrEqual(2);
      expect(node.treatiseList.length).toBeGreaterThanOrEqual(2);
    }
    for (const route of ODYSSEYS) {
      for (let index = 0; index < route.stops.length; index += 1) {
        const node = NODE_BY_ID.get(route.stops[index]!);
        expect(node).toBeDefined();
        if (index > 0) expect(NODE_BY_ID.get(route.stops[index - 1]!)!.startYear).toBeLessThan(node!.startYear);
      }
    }
  });
});
