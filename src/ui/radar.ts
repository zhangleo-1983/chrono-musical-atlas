import type { Radar } from '../domain/types';

export const RADAR_AXES: { key: keyof Radar; label: string }[] = [
  { key: 'rhythm', label: '节奏复杂度' }, { key: 'harmony', label: '和声丰富度' }, { key: 'improvisation', label: '即兴自由度' }, { key: 'ensemble', label: '编制规模' }, { key: 'fusion', label: '跨文化融合度' },
];
export function radarPoints(radar: Radar, cx: number, cy: number, radius: number): [number, number][] {
  return RADAR_AXES.map((axis, index) => { const angle = -Math.PI / 2 + index * (Math.PI * 2 / RADAR_AXES.length); const value = radar[axis.key] / 100 * radius; return [cx + Math.cos(angle) * value, cy + Math.sin(angle) * value]; });
}
