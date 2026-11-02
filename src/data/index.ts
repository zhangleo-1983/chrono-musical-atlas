import { eraOf } from '../domain/eras';
import type { ResolvedNode } from '../domain/types';
import { RAW_NODES } from './nodes';

const influenceMap = new Map<string, string[]>();
for (const node of RAW_NODES) influenceMap.set(node.id, []);
for (const node of RAW_NODES) {
  for (const parentId of node.influencedBy) influenceMap.get(parentId)?.push(node.id);
}

export const NODES: ResolvedNode[] = [...RAW_NODES]
  .sort((a, b) => a.startYear - b.startYear)
  .map((node) => ({ ...node, era: eraOf(node.startYear), influences: [...(influenceMap.get(node.id) ?? [])] }));

export const NODE_BY_ID: ReadonlyMap<string, ResolvedNode> = new Map(NODES.map((node) => [node.id, node]));
export { PRESETS } from './presets';
export { ODYSSEYS } from './odysseys';
