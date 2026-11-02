import { GENRE_LABELS } from './genres';
import type { ResolvedNode } from './types';

export interface SearchHit { node: ResolvedNode; matchedOn: string }

export function searchNodes(q: string, nodes: ResolvedNode[], limit = 8): SearchHit[] {
  const query = q.trim().toLocaleLowerCase();
  if (!query || limit <= 0) return [];
  const hits = nodes.flatMap((node) => {
    const fields: [string, string][] = [
      ['name', node.name], ['nameEn', node.nameEn], ['city', node.city], ['genre', GENRE_LABELS[node.genre]],
      ...node.musicians.flatMap((m) => [['musician', m.name], ['musicianEn', m.nameEn]] as [string, string][]),
    ];
    const matched = fields.find(([, value]) => value.toLocaleLowerCase().includes(query));
    if (!matched) return [];
    const [matchedOn, value] = matched;
    const normalized = value.toLocaleLowerCase();
    const nameRank = matchedOn === 'name' ? 0 : matchedOn === 'nameEn' ? 1 : 2;
    const exactRank = normalized === query ? 0 : normalized.startsWith(query) ? 1 : 2;
    return [{ node, matchedOn, rank: nameRank * 3 + exactRank }];
  });
  return hits.sort((a, b) => a.rank - b.rank || a.node.startYear - b.node.startYear).slice(0, limit).map(({ node, matchedOn }) => ({ node, matchedOn }));
}
