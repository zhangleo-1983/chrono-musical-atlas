import { useEffect } from 'react';
import { audioEngine } from '../audio/engine';
import { PATCHES } from '../audio/patches';
import { NODE_BY_ID } from '../data';
import { GENRE_COLORS, GENRE_LABELS } from '../domain/genres';
import { formatYear } from '../domain/timeScale';
import { useAtlasStore } from '../store/atlasStore';
import SoundPlayer from './SoundPlayer';
import './hud.css';

export default function NodeDrawer() {
  const { selectedId, compare, compareOpen, selectNode, setCompareOpen, addToCompare } = useAtlasStore();
  const node = selectedId ? NODE_BY_ID.get(selectedId) : undefined;
  useEffect(() => () => audioEngine.stop(), [selectedId]);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key !== 'Escape') return; if (compareOpen) setCompareOpen(false); else selectNode(null); }; document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey); }, [compareOpen, selectNode, setCompareOpen]);
  if (!node) return null;
  const yearLabel = `${formatYear(node.startYear)} — ${node.endYear === null ? '至今' : formatYear(node.endYear)}`;
  const spotify = `https://open.spotify.com/search/${encodeURIComponent(node.nameEn)}`; const youtube = `https://www.youtube.com/results?search_query=${encodeURIComponent(node.nameEn)}`;
  return <aside className="node-drawer" aria-label={`${node.name}档案`}><div className="drawer-scroll"><div className="drawer-heading"><div><span className="eyebrow">MUSIC NODE / {node.era.toUpperCase()}</span><h2>{node.name}</h2><p>{node.nameEn}</p></div><button type="button" className="close-button" aria-label="关闭档案" onClick={() => selectNode(null)}>×</button></div><div className="drawer-meta"><span>{yearLabel}</span><span>{node.city} · {node.region}</span><span className="genre-badge" style={{ color: GENRE_COLORS[node.genre] }}>{GENRE_LABELS[node.genre]}</span></div><SoundPlayer playKey={node.id} patch={node.patch} label={PATCHES[node.patch].label} /><section className="drawer-section"><h3>代表作</h3><div className="tag-list">{node.works.map((work) => <span className="info-tag" key={work}>{work}</span>)}</div></section><section className="drawer-section"><h3>代表音乐家</h3>{node.musicians.map((musician) => <div className="musician" key={musician.name}><strong>{musician.name}</strong><span>{musician.nameEn} · {musician.lifespan}</span><small>{musician.knownFor}</small></div>)}</section><section className="drawer-section"><h3>音色与特征</h3><div className="tag-list">{[...node.instruments, ...node.traits].map((item) => <span className="info-tag" key={item}>{item}</span>)}</div></section><section className="drawer-section"><h3>历史解读</h3><p className="summary">{node.summary}</p></section><section className="drawer-section"><h3>谱系</h3><div className="lineage-links"><span className="lineage-label">前驱</span>{node.influencedBy.length ? node.influencedBy.map((id) => <button type="button" key={id} onClick={() => selectNode(id, { reveal: true, focus: true })}>{NODE_BY_ID.get(id)?.name}</button>) : <span className="empty-lineage">无已记录前驱</span>}<span className="lineage-label">后继</span>{node.influences.length ? node.influences.map((id) => <button type="button" key={id} onClick={() => selectNode(id, { reveal: true, focus: true })}>{NODE_BY_ID.get(id)?.name}</button>) : <span className="empty-lineage">暂无已记录后继</span>}</div></section><div className="drawer-actions"><button type="button" className="compare-add" disabled={compare.includes(node.id)} onClick={() => addToCompare(node.id)}>{compare.includes(node.id) ? '已加入对比' : '+ 加入对比'}</button><a href={spotify} target="_blank" rel="noopener noreferrer">Spotify</a><a href={youtube} target="_blank" rel="noopener noreferrer">YouTube</a></div></div></aside>;
}
