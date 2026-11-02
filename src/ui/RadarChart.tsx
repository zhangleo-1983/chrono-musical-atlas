import { GENRE_COLORS } from '../domain/genres';
import type { ResolvedNode } from '../domain/types';
import { RADAR_AXES, radarPoints } from './radar';

interface RadarChartProps { a: ResolvedNode; b: ResolvedNode }
const points = (values: [number, number][]) => values.map(([x, y]) => `${x},${y}`).join(' ');

export default function RadarChart({ a, b }: RadarChartProps) {
  const cx = 150; const cy = 135; const radius = 88; const axes = RADAR_AXES.map((_, index) => radarPoints({ rhythm: 100, harmony: 100, improvisation: 100, ensemble: 100, fusion: 100 }, cx, cy, radius)[index]!);
  const rings = [0.25, 0.5, 0.75, 1].map((scale) => points(axes.map(([x, y]) => [cx + (x - cx) * scale, cy + (y - cy) * scale] as [number, number])));
  const aPoints = radarPoints(a.radar, cx, cy, radius); const bPoints = radarPoints(b.radar, cx, cy, radius); const sameGenre = a.genre === b.genre;
  return <div className="radar-wrap"><svg viewBox="0 0 300 270" aria-label="五维特征雷达图">{rings.map((ring) => <polygon key={ring} points={ring} className="radar-ring" />)}{axes.map(([x, y], index) => <line key={index} x1={cx} y1={cy} x2={x} y2={y} className="radar-axis" />)}<polygon points={points(aPoints)} fill={GENRE_COLORS[a.genre]} fillOpacity="0.24" stroke={GENRE_COLORS[a.genre]} strokeWidth="2" /> <polygon points={points(bPoints)} fill={sameGenre ? 'transparent' : GENRE_COLORS[b.genre]} fillOpacity={sameGenre ? 0 : 0.15} stroke={sameGenre ? '#fff' : GENRE_COLORS[b.genre]} strokeWidth="2" strokeDasharray={sameGenre ? '5 4' : undefined} />{RADAR_AXES.map((axis, index) => { const [x, y] = axes[index]!; return <text key={axis.key} x={cx + (x - cx) * 1.2} y={cy + (y - cy) * 1.2} className="radar-label" textAnchor="middle">{axis.label}</text>; })}</svg><div className="radar-legend"><span style={{ color: GENRE_COLORS[a.genre] }}>A · {a.name}</span><span style={{ color: sameGenre ? '#fff' : GENRE_COLORS[b.genre] }}>B · {b.name}</span></div></div>;
}
