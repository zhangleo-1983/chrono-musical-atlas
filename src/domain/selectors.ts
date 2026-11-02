import { ERA_IDS, ERAS } from './eras';
import { GENRES } from './genres';
import { eraRangeT, tToYear, yearToT } from './timeScale';
import type { EraId, GenreId, MusicNode, ResolvedNode } from './types';

export type TimeState = 'active' | 'past' | 'future';
export interface FilterState { era: EraId | 'all'; year: number | null; genres: ReadonlySet<GenreId> }

function overlapsEra(n: MusicNode, era: EraId): boolean {
  const range = ERAS[era];
  return n.startYear < range.end && (n.endYear === null || n.endYear > range.start);
}

export function nodeTimeState(n: MusicNode, era: EraId | 'all', year: number | null): TimeState {
  if (year !== null) {
    if (n.startYear > year) return 'future';
    if (n.endYear !== null && n.endYear < year) return 'past';
    return 'active';
  }
  if (era === 'all' || ERA_IDS.some((id) => id === era && overlapsEra(n, id))) return 'active';
  return 'future';
}

export function isVisible(n: MusicNode, f: FilterState): boolean {
  return nodeTimeState(n, f.era, f.year) !== 'future' && (f.genres.size === 0 || f.genres.has(n.genre));
}

export function lineage(id: string, byId: ReadonlyMap<string, ResolvedNode>): { nodeIds: Set<string>; edgeKeys: Set<string> } {
  const nodeIds = new Set<string>();
  const edgeKeys = new Set<string>();
  const visitParents = (currentId: string) => {
    if (nodeIds.has(currentId)) return;
    nodeIds.add(currentId);
    const node = byId.get(currentId);
    if (!node) return;
    for (const parentId of node.influencedBy) {
      edgeKeys.add(`${parentId}->${currentId}`);
      visitParents(parentId);
    }
  };
  visitParents(id);
  const visitChildren = (currentId: string) => {
    const node = byId.get(currentId);
    if (!node) return;
    for (const childId of node.influences) {
      nodeIds.add(childId);
      edgeKeys.add(`${currentId}->${childId}`);
      visitChildren(childId);
    }
  };
  visitChildren(id);
  return { nodeIds, edgeKeys };
}

export function computeActivity(nodes: ResolvedNode[], buckets: number): Record<GenreId, number[]> {
  const activity = Object.fromEntries(GENRES.map(({ id }) => [id, Array.from({ length: buckets }, () => 0)])) as Record<GenreId, number[]>;
  if (buckets <= 0) return activity;
  for (let i = 0; i < buckets; i += 1) {
    const t = buckets === 1 ? 0 : i / (buckets - 1);
    const year = tToYear(t);
    for (const node of nodes) if (nodeTimeState(node, 'all', year) === 'active') activity[node.genre]![i]! += node.influence;
  }
  return activity;
}

export { eraRangeT, yearToT };
