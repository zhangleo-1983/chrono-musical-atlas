import { describe, expect, it } from 'vitest';
import { NODE_BY_ID, NODES } from '../data';
import { nodeTimeState, isVisible, lineage, computeActivity } from './selectors';

describe('selectors', () => {
  it('handles era windows and node endpoints', () => {
    const gagaku = NODE_BY_ID.get('gagaku')!;
    const bach = NODE_BY_ID.get('leipzig-baroque')!;
    expect(nodeTimeState(gagaku, 'baroque', null)).toBe('active');
    expect(nodeTimeState(bach, 'all', 1700)).toBe('active');
    expect(nodeTimeState(bach, 'all', 1699)).toBe('future');
    expect(nodeTimeState(bach, 'all', 1750)).toBe('active');
    expect(nodeTimeState(bach, 'all', 1751)).toBe('past');
  });
  it('filters genres without changing time semantics', () => {
    const node = NODE_BY_ID.get('new-orleans-jazz')!;
    expect(isVisible(node, { era: 'all', year: null, genres: new Set() })).toBe(true);
    expect(isVisible(node, { era: 'all', year: null, genres: new Set(['classical']) })).toBe(false);
  });
  it('collects a diamond lineage without duplicates', () => {
    const result = lineage('new-orleans-jazz', NODE_BY_ID);
    expect(result.nodeIds.has('new-orleans-jazz')).toBe(true);
    expect(result.nodeIds.has('griot-mali')).toBe(true);
    expect(result.edgeKeys.has('griot-mali->new-orleans-jazz')).toBe(true);
    expect(result.nodeIds.size).toBe(new Set(result.nodeIds).size);
  });
  it('computes genre activity buckets', () => {
    const activity = computeActivity(NODES, 12);
    expect(Object.values(activity).every((values) => values.length === 12)).toBe(true);
    expect(activity.ritual.some((value) => value > 0)).toBe(true);
  });
});
