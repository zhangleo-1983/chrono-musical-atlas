import { useEffect, useRef, useState } from 'react';
import { audioEngine } from '../audio/engine';
import { PATCHES } from '../audio/patches';
import { ARTIFACT_IMAGES, NODE_BY_ID } from '../data';
import { GENRE_COLORS, GENRE_LABELS } from '../domain/genres';
import { formatYear } from '../domain/timeScale';
import type { ResolvedNode } from '../domain/types';
import { useAudioState } from '../audio/useAudioState';
import { useAtlasStore } from '../store/atlasStore';
import BlueprintFigure from './BlueprintFigure';
import ArtifactLightbox from './ArtifactLightbox';
import { RADAR_AXES } from './radar';
import SoundPlayer from './SoundPlayer';
import './hud.css';

const TABS = ['🎵 概览名曲', '👤 人物典故', '🏛️ 制度典籍', '📐 器物律制'] as const;

function Lineage({ node, selectNode }: { node: ResolvedNode; selectNode: (id: string, opts: { reveal: true; focus: true }) => void }) {
  return <div className="lineage-links">
    <span className="lineage-label">前驱</span>
    {node.influencedBy.length ? node.influencedBy.map((id) => <button type="button" key={id} onClick={() => selectNode(id, { reveal: true, focus: true })}>{NODE_BY_ID.get(id)?.name}</button>) : <span className="empty-lineage">无已记录前驱</span>}
    <span className="lineage-label">后继</span>
    {node.influences.length ? node.influences.map((id) => <button type="button" key={id} onClick={() => selectNode(id, { reveal: true, focus: true })}>{NODE_BY_ID.get(id)?.name}</button>) : <span className="empty-lineage">暂无已记录后继</span>}
  </div>;
}

function DrawerContent({ node, compare, selectNode, addToCompare }: { node: ResolvedNode; compare: [string | null, string | null]; selectNode: (id: string, opts: { reveal: true; focus: true }) => void; addToCompare: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [artifactOpen, setArtifactOpen] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const artifactTriggerRef = useRef<HTMLButtonElement | null>(null);
  const { playingKey } = useAudioState();
  const resonating = playingKey === node.id;
  const yearLabel = `${formatYear(node.startYear)} — ${node.endYear === null ? '至今' : formatYear(node.endYear)}`;
  const searchQuery = node.searchQuery ?? node.nameEn;
  const spotify = `https://open.spotify.com/search/${encodeURIComponent(searchQuery)}`;
  const youtube = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
  const artifactImage = ARTIFACT_IMAGES[node.id];
  const openArtifact = (trigger: HTMLButtonElement) => { artifactTriggerRef.current = trigger; setArtifactOpen(true); };
  const closeArtifact = () => setArtifactOpen(false);
  const moveTab = (direction: number) => setActiveTab((current) => {
    const next = (current + direction + TABS.length) % TABS.length;
    requestAnimationFrame(() => tabRefs.current[next]?.focus());
    return next;
  });
  return <>
    <div className="drawer-hero">
      <div className="drawer-heading"><div><span className="eyebrow">MUSIC NODE / {node.era.toUpperCase()}</span><h2>{node.name}</h2><p>{node.nameEn}</p></div><button type="button" className="close-button" aria-label="关闭档案" onClick={() => useAtlasStore.getState().selectNode(null)}>×</button></div>
      <div className="drawer-meta"><span>{yearLabel}</span><span>{node.city} · {node.region}</span><span className="genre-badge" style={{ color: GENRE_COLORS[node.genre] }}>{GENRE_LABELS[node.genre]}</span></div>
      <BlueprintFigure node={node} resonating={resonating} onOpenArtifact={openArtifact} />
      <SoundPlayer playKey={node.id} patch={node.patch} label={PATCHES[node.patch].label} />
    </div>
    <div className="drawer-tabs" role="tablist" aria-label="节点档案分页">
      {TABS.map((label, index) => <button type="button" role="tab" key={label} ref={(element) => { tabRefs.current[index] = element; }} id={`drawer-tab-${index}`} aria-controls="drawer-tabpanel" aria-selected={activeTab === index} tabIndex={activeTab === index ? 0 : -1} onClick={() => setActiveTab(index)} onKeyDown={(event) => { if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveTab(1); } if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveTab(-1); } }}>{label}</button>)}
    </div>
    <div className="drawer-panel" id="drawer-tabpanel" role="tabpanel" aria-labelledby={`drawer-tab-${activeTab}`}>
      {activeTab === 0 && <><section className="drawer-section"><h3>历史解读</h3><p className="summary">{node.summary}</p></section><section className="drawer-section"><h3>代表作</h3><div className="tag-list">{node.works.map((work) => <span className="info-tag" key={work}>{work}</span>)}</div></section><section className="drawer-section"><h3>音色与特征</h3><div className="tag-list">{[...node.instruments, ...node.traits].map((item) => <span className="info-tag" key={item}>{item}</span>)}</div></section></>}
      {activeTab === 1 && <><section className="drawer-section"><h3>代表音乐家</h3>{node.musicians.map((musician) => <div className="musician" key={musician.name}><strong>{musician.name}</strong><span>{musician.nameEn} · {musician.lifespan}</span><small>{musician.knownFor}</small></div>)}</section><section className="drawer-section"><h3>人物典故</h3><p className="summary">{node.story}</p></section></>}
      {activeTab === 2 && <><section className="drawer-section"><h3>礼乐制度 / 规范</h3><p className="drawer-fact">{node.institution}</p></section><section className="drawer-section"><h3>传世典籍</h3><div className="tag-list">{node.treatises.map((treatise) => <span className="info-tag" key={treatise}>{treatise}</span>)}</div></section></>}
      {activeTab === 3 && <><section className="drawer-section"><h3>考古文物 / 历史载体</h3><p className="drawer-fact">{node.artifact}</p><button type="button" className="museum-link" onClick={(event) => openArtifact(event.currentTarget)}>查看博物馆文物实拍图</button></section><section className="drawer-section"><h3>律制与声学体系</h3><p className="drawer-fact">{node.tuningSystem}</p></section><section className="drawer-section"><h3>五维声学画像</h3><div className="radar-bars">{RADAR_AXES.map((axis) => <div className="radar-bar" key={axis.key}><span>{axis.label}</span><i><b style={{ width: `${node.radar[axis.key]}%` }} /></i><em>{node.radar[axis.key]}</em></div>)}</div></section></>}
    </div>
    <div className="drawer-footer"><Lineage node={node} selectNode={selectNode} /><div className="drawer-actions"><button type="button" className="compare-add" disabled={compare.includes(node.id)} onClick={() => addToCompare(node.id)}>{compare.includes(node.id) ? '已加入对比' : '+ 加入对比'}</button><a href={spotify} target="_blank" rel="noopener noreferrer">Spotify</a><a href={youtube} target="_blank" rel="noopener noreferrer">YouTube</a></div></div>
    {artifactOpen && artifactImage && <ArtifactLightbox image={artifactImage} onClose={closeArtifact} returnFocusRef={artifactTriggerRef} />}
  </>;
}

export default function NodeDrawer() {
  const { selectedId, compare, compareOpen, selectNode, setCompareOpen, addToCompare } = useAtlasStore();
  const node = selectedId ? NODE_BY_ID.get(selectedId) : undefined;
  useEffect(() => () => audioEngine.stop(), [selectedId]);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key !== 'Escape') return; if (compareOpen) setCompareOpen(false); else selectNode(null); }; document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey); }, [compareOpen, selectNode, setCompareOpen]);
  if (!node) return null;
  return <aside className="node-drawer" aria-label={`${node.name}档案`}><div className="drawer-handle" aria-hidden="true" /><DrawerContent key={node.id} node={node} compare={compare} selectNode={(id, opts) => selectNode(id, opts)} addToCompare={addToCompare} /></aside>;
}
