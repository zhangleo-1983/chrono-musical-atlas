import { useEffect, useMemo, useRef, useState } from 'react';
import { NODES } from '../data';
import { GENRES } from '../domain/genres';
import { searchNodes } from '../domain/search';
import { useAtlasStore } from '../store/atlasStore';
import './hud.css';

export default function TopBar() {
  const { genres, showArcs, toggleGenre, clearGenres, toggleArcs, selectNode } = useAtlasStore();
  const [query, setQuery] = useState(''); const [open, setOpen] = useState(false); const [active, setActive] = useState(0); const [composing, setComposing] = useState(false); const wrapRef = useRef<HTMLDivElement>(null);
  const hits = useMemo(() => searchNodes(query, NODES), [query]);
  useEffect(() => { const close = (event: MouseEvent) => { if (!wrapRef.current?.contains(event.target as Node)) setOpen(false); }; document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close); }, []);
  const choose = (index: number) => { const hit = hits[index]; if (!hit) return; selectNode(hit.node.id, { reveal: true, focus: true }); setQuery(''); setOpen(false); setActive(0); };
  return <header className="hud-top">
    <div className="brand"><h1>CHRONO·MUSICAL ATLAS</h1><p>world music civilization / 7000 BCE → now</p></div>
    <div className="genre-list">{GENRES.map((genre) => <button key={genre.id} type="button" className="pill" aria-pressed={genres.has(genre.id)} onClick={() => toggleGenre(genre.id)}><span className="color-dot" style={{ background: genre.color }} />{genre.label}</button>)}<button type="button" className="clear-button" onClick={clearGenres}>清除</button></div>
    <div className="search-wrap" ref={wrapRef}><input className="search-input" value={query} placeholder="搜索节点、音乐家、城市" aria-label="搜索音乐史节点" onChange={(event) => { setQuery(event.target.value); setOpen(true); setActive(0); }} onFocus={() => setOpen(true)} onCompositionStart={() => setComposing(true)} onCompositionEnd={() => setComposing(false)} onKeyDown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); setActive((value) => Math.min(value + 1, Math.max(0, hits.length - 1))); } else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((value) => Math.max(0, value - 1)); } else if (event.key === 'Enter' && !composing && !event.nativeEvent.isComposing) { event.preventDefault(); choose(active); } else if (event.key === 'Escape') setOpen(false); }} />{open && query.trim() && <div className="search-menu">{hits.length ? hits.map((hit, index) => <button type="button" key={hit.node.id} className={`search-result ${index === active ? 'is-active' : ''}`} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(index)}>{hit.node.name}<small>{hit.node.nameEn} · {hit.node.city}</small></button>) : <div className="no-result">未找到</div>}</div>}</div>
    <button type="button" className="arc-toggle" aria-pressed={showArcs} onClick={toggleArcs}>{showArcs ? '飞线 ON' : '飞线 OFF'}</button>
  </header>;
}
