import { describe, expect, it } from 'vitest';
import { NODES } from '../data';
import { arcPath, buildArcs, buildRouteArcs } from './arcs';

describe('map arcs', () => {
  it('is deterministic and uses one arc for every influence edge', () => {
    expect(arcPath([10, 20], [80, 60])).toBe(arcPath([10, 20], [80, 60]));
    const forward = arcPath([10, 20], [80, 60]);
    const reverse = arcPath([80, 60], [10, 20]);
    expect(forward.replace(/^M [^Q]+ Q /, '').split(' ')[0]).toBe(reverse.replace(/^M [^Q]+ Q /, '').split(' ')[0]);
    expect(buildArcs(NODES)).toHaveLength(NODES.reduce((sum, node) => sum + node.influencedBy.length, 0));
    expect(buildRouteArcs(NODES.slice(0, 5))).toHaveLength(4);
    expect(buildRouteArcs(NODES.slice(0, 1))).toHaveLength(0);
  });
});
