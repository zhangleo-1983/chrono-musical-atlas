import { useEffect } from 'react';
import { audioEngine } from '../audio/engine';
import { NODE_BY_ID } from '../data';
import { GENRE_COLORS, GENRE_LABELS } from '../domain/genres';
import { formatYear } from '../domain/timeScale';
import { useAtlasStore } from '../store/atlasStore';
import RadarChart from './RadarChart';
import SoundPlayer from './SoundPlayer';
import './hud.css';

export default function CompareModal() {
  const { compare, compareOpen, setCompareOpen, selectNode } = useAtlasStore(); const a = compare[0] ? NODE_BY_ID.get(compare[0]) : undefined; const b = compare[1] ? NODE_BY_ID.get(compare[1]) : undefined;
  useEffect(() => { if (!compareOpen) audioEngine.stop(); }, [compareOpen]); useEffect(() => () => audioEngine.stop(), []);
  if (!compareOpen || !a || !b) return null;
  const relation = a.influencedBy.includes(b.id) ? `${b.name} → ${a.name}` : b.influencedBy.includes(a.id) ? `${a.name} → ${b.name}` : null;
  const jump = (id: string) => { setCompareOpen(false); selectNode(id, { reveal: true, focus: true }); };
  const row = (label: string, left: React.ReactNode, right: React.ReactNode) => <tr key={label}><th>{label}</th><td>{left}</td><td>{right}</td></tr>;
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCompareOpen(false); }}><section className="compare-modal" role="dialog" aria-modal="true" aria-label="深度对比"><div className="modal-header"><div><span className="eyebrow">COMPARISON DOCK</span><h2>跨时空双卡对比</h2></div><button type="button" className="close-button" onClick={() => setCompareOpen(false)}>×</button></div>{relation && <div className="relation-note">直接影响关系 · {relation}</div>}<RadarChart a={a} b={b} /><div className="compare-audio"><SoundPlayer playKey="A" patch={a.patch} label={`A / ${a.name}`} /><SoundPlayer playKey="B" patch={b.patch} label={`B / ${b.name}`} /></div><table className="compare-table"><thead><tr><th>维度</th><th style={{ color: GENRE_COLORS[a.genre] }}>A · <button type="button" onClick={() => jump(a.id)}>{a.name}</button></th><th style={{ color: GENRE_COLORS[b.genre] }}>B · <button type="button" onClick={() => jump(b.id)}>{b.name}</button></th></tr></thead><tbody>{row('流派', GENRE_LABELS[a.genre], GENRE_LABELS[b.genre])}{row('年代', `${formatYear(a.startYear)} — ${a.endYear === null ? '至今' : formatYear(a.endYear)}`, `${formatYear(b.startYear)} — ${b.endYear === null ? '至今' : formatYear(b.endYear)}`)}{row('城市与坐标', `${a.city} (${a.lat}, ${a.lon})`, `${b.city} (${b.lat}, ${b.lon})`)}{row('代表大师', a.musicians.map((m) => m.name).join('、'), b.musicians.map((m) => m.name).join('、'))}{row('核心乐器', a.instruments.join(' · '), b.instruments.join(' · '))}{row('音阶 / 律动', a.traits.join(' · '), b.traits.join(' · '))}{row('前驱', a.influencedBy.map((id) => NODE_BY_ID.get(id)?.name).join('、') || '—', b.influencedBy.map((id) => NODE_BY_ID.get(id)?.name).join('、') || '—')}{row('后继', a.influences.map((id) => NODE_BY_ID.get(id)?.name).join('、') || '—', b.influences.map((id) => NODE_BY_ID.get(id)?.name).join('、') || '—')}{row('礼乐制度 / 规范', a.institution, b.institution)}{row('传世典籍', a.treatises.join('、'), b.treatises.join('、'))}{row('律制体系', a.tuningSystem, b.tuningSystem)}</tbody></table></section></div>;
}
