import type { ResolvedNode } from '../domain/types';
import { project } from './projection';

export interface Arc { key: string; from: string; to: string; d: string }

function controlPoint(a: [number, number], b: [number, number]): [number, number] {
  const [start, end] = a[0] < b[0] || (a[0] === b[0] && a[1] <= b[1]) ? [a, b] : [b, a];
  const dx = end[0] - start[0]; const dy = end[1] - start[1]; const length = Math.hypot(dx, dy) || 1;
  const midX = (a[0] + b[0]) / 2; const midY = (a[1] + b[1]) / 2;
  const direction = midX * 13 + midY * 7 >= 0 ? 1 : -1;
  return [midX - (dy / length) * length * 0.18 * direction, midY + (dx / length) * length * 0.18 * direction];
}

export function arcPath(a: [number, number], b: [number, number]): string {
  const [cx, cy] = controlPoint(a, b);
  return `M ${a[0].toFixed(2)} ${a[1].toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${b[0].toFixed(2)} ${b[1].toFixed(2)}`;
}

export function buildArcs(nodes: ResolvedNode[]): Arc[] {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  return nodes.flatMap((node) => node.influencedBy.flatMap((parentId) => {
    const parent = byId.get(parentId);
    if (!parent) return [];
    return [{ key: `${parent.id}->${node.id}`, from: parent.id, to: node.id, d: arcPath(project(parent.lon, parent.lat), project(node.lon, node.lat)) }];
  }));
}
