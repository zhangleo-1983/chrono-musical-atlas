import { useEffect, useMemo, useRef, useState } from 'react';
import { NODES, ODYSSEYS } from '../data';
import { GENRE_COLORS } from '../domain/genres';
import { isVisible, lineage, nodeTimeState } from '../domain/selectors';
import { useAtlasStore } from '../store/atlasStore';
import { buildArcs, buildRouteArcs } from './arcs';
import { GRID_PATH, LAND_PATH, project, VIEW_H, VIEW_W } from './projection';
import { clamp, focusCenter, focusOn, FULL_BOX, IDENTITY, lerpViewport, pan, pinch, type Viewport, visibleBox, zoomAt, type VisibleBox } from './viewport';
import { useCompact } from '../ui/useCompact';
import './map.css';

const STARS = Array.from({ length: 90 }, (_, i) => ({ x: (i * 83) % VIEW_W, y: (i * 47) % VIEW_H, r: i % 7 === 0 ? 1.2 : 0.55 }));
const LABEL_OFFSETS: Record<string, { x: number; y: number; anchor: 'start' | 'end' }> = {
  'leipzig-baroque': { x: 12, y: -24, anchor: 'start' },
  'vienna-classical': { x: 10, y: 18, anchor: 'start' },
  'london-rock': { x: -20, y: 14, anchor: 'end' },
};

export default function MapView() {
  const compact = useCompact();
  const { era, year, genres, showArcs, selectedId, hoveredId, odyssey, compareOpen, selectNode, setHovered } = useAtlasStore();
  const arcs = useMemo(() => buildArcs(NODES), []);
  const activeRoute = odyssey ? ODYSSEYS.find((route) => route.id === odyssey.routeId) : undefined;
  const routeStops = activeRoute?.stops.map((id) => NODES.find((node) => node.id === id)).filter((node): node is typeof NODES[number] => node !== undefined) ?? [];
  const routeArcs = useMemo(() => buildRouteArcs(routeStops), [activeRoute?.id]);
  const routeNodeIds = useMemo(() => new Set(routeStops.map((node) => node.id)), [activeRoute?.id]);
  const focusNonce = useAtlasStore((state) => state.focus?.nonce);
  const [isZoomed, setIsZoomed] = useState(false);
  const [resetTop, setResetTop] = useState<number | null>(null);
  const zoomedRef = useRef(false);
  const shellRef = useRef<HTMLDivElement>(null); const svgRef = useRef<SVGSVGElement>(null); const worldRef = useRef<SVGGElement>(null); const viewportRef = useRef<Viewport>({ ...IDENTITY }); const visibleBoxRef = useRef<VisibleBox>(FULL_BOX);
  const animationRef = useRef<number | null>(null); const pointerRef = useRef({ id: -1, x: 0, y: 0, moved: false, captured: false }); const activePointersRef = useRef(new Map<number, [number, number]>()); const pinchPreviousRef = useRef(new Map<number, [number, number]>()); const ignoreNextClick = useRef(false);
  const applyViewport = (next: Viewport) => { const viewport = clamp(next, visibleBoxRef.current); viewportRef.current = viewport; worldRef.current?.setAttribute('transform', `translate(${viewport.x} ${viewport.y}) scale(${viewport.k})`); svgRef.current?.style.setProperty('--k', String(viewport.k)); const zoomed = viewport.k >= (compact ? 2 : 2.5); if (zoomed !== zoomedRef.current) { zoomedRef.current = zoomed; setIsZoomed(zoomed); } };
  const cancelAnimation = () => { if (animationRef.current !== null) cancelAnimationFrame(animationRef.current); animationRef.current = null; };
  const viewBoxPoint = (event: PointerEvent | WheelEvent): [number, number] => { const svg = svgRef.current; const ctm = svg?.getScreenCTM()?.inverse(); if (!svg || !ctm) return [event.offsetX, event.offsetY]; const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm); return [point.x, point.y]; };
  const animateTo = (target: Viewport) => { cancelAnimation(); const from = viewportRef.current; const started = performance.now(); const run = (now: number) => { const progress = Math.min(1, (now - started) / 450); applyViewport(lerpViewport(from, target, progress)); if (progress < 1) animationRef.current = requestAnimationFrame(run); else animationRef.current = null; }; animationRef.current = requestAnimationFrame(run); };

  useEffect(() => { applyViewport(viewportRef.current); return cancelAnimation; }, []);
  useEffect(() => {
    const shell = shellRef.current; if (!shell) return;
    const measure = () => { const rect = shell.getBoundingClientRect(); visibleBoxRef.current = visibleBox(rect.width, rect.height, compact ? 'slice' : 'meet'); applyViewport(viewportRef.current); };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure); observer.observe(shell); return () => observer.disconnect();
  }, [compact]);
  useEffect(() => {
    if (!compact) { setResetTop(null); return; }
    const measure = () => {
      const hudBottom = document.querySelector('.hud-top')?.getBoundingClientRect().bottom ?? 0;
      const odysseyBottom = document.querySelector('.odyssey-bar')?.getBoundingClientRect().bottom ?? 0;
      setResetTop(Math.max(hudBottom, odysseyBottom) + 8);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    document.querySelectorAll('.hud-top, .odyssey-bar').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [compact, Boolean(odyssey)]);
  useEffect(() => {
    const svg = svgRef.current; if (!svg) return;
    const onWheel = (event: WheelEvent) => { event.preventDefault(); cancelAnimation(); const point = viewBoxPoint(event); applyViewport(zoomAt(viewportRef.current, point[0], point[1], Math.exp(-event.deltaY * 0.001), visibleBoxRef.current)); };
    svg.addEventListener('wheel', onWheel, { passive: false }); return () => svg.removeEventListener('wheel', onWheel);
  }, []);
  useEffect(() => { const target = useAtlasStore.getState().focus; if (!target) return; const node = NODES.find((item) => item.id === target.id); if (!node) return; const point = project(node.lon, node.lat); const selected = useAtlasStore.getState().selectedId; const box = visibleBoxRef.current; const center: [number, number] = compact ? (() => { const shellHeight = shellRef.current?.getBoundingClientRect().height ?? 0; const hudBottom = document.querySelector('.hud-top')?.getBoundingClientRect().bottom ?? 0; const odysseyBottom = document.querySelector('.odyssey-bar')?.getBoundingClientRect().bottom ?? 0; const topPx = Math.max(hudBottom, odysseyBottom); const drawerTop = document.querySelector('.node-drawer')?.getBoundingClientRect().top; const bottomPx = drawerTop ?? shellHeight - Math.min(shellHeight * 0.58, 520); return focusCenter(box, shellHeight, topPx, bottomPx); })() : selected ? [VIEW_W * 0.38, VIEW_H * 0.5] : [VIEW_W / 2, VIEW_H / 2]; animateTo(focusOn(point, Math.max(viewportRef.current.k, 3), center)); }, [focusNonce, compact]);
  const selectedLineage = useMemo(() => selectedId ? lineage(selectedId, new Map(NODES.map((node) => [node.id, node]))) : { nodeIds: new Set<string>(), edgeKeys: new Set<string>() }, [selectedId]);
  const visible = (id: string) => { const node = NODES.find((item) => item.id === id); return node ? isVisible(node, { era, year, genres }) : false; };
  const arcVisible = (from: string, to: string) => showArcs && visible(from) && visible(to) && nodeTimeState(NODES.find((node) => node.id === from)!, era, year) !== 'future' && nodeTimeState(NODES.find((node) => node.id === to)!, era, year) !== 'future';
  const highlightedNodeIds = odyssey ? routeNodeIds : selectedLineage.nodeIds;
  const highlightedEdgeKeys = odyssey ? new Set(routeArcs.map((arc) => arc.key)) : selectedLineage.edgeKeys;
  const orderedNodes = [...NODES.filter((node) => visible(node.id))].sort((a, b) => Number(highlightedNodeIds.has(a.id)) - Number(highlightedNodeIds.has(b.id)));
  const orderedArcs = [...arcs.filter((arc) => arcVisible(arc.from, arc.to))].sort((a, b) => Number(highlightedEdgeKeys.has(a.key)) - Number(highlightedEdgeKeys.has(b.key)));
  const visibleRouteArcs = routeArcs.filter((arc) => visible(arc.from) && visible(arc.to));
  const coarsePointer = compact || (typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches);
  const clearIgnoredClick = () => { window.setTimeout(() => { ignoreNextClick.current = false; }, 0); };

  return <div ref={shellRef} className="map-shell">
    <svg ref={svgRef} className="map-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio={compact ? 'xMidYMid slice' : 'xMidYMid meet'} aria-label="世界音乐史地图" onClick={() => { if (!ignoreNextClick.current) selectNode(null); ignoreNextClick.current = false; }} onPointerDown={(event) => { cancelAnimation(); const point = viewBoxPoint(event.nativeEvent); const pointers = activePointersRef.current; pointers.set(event.pointerId, point); if (pointers.size >= 2) { ignoreNextClick.current = true; pointerRef.current = { id: -1, x: 0, y: 0, moved: true, captured: false }; pinchPreviousRef.current = new Map(pointers); return; } pointerRef.current = { id: event.pointerId, x: point[0], y: point[1], moved: false, captured: false }; }} onPointerMove={(event) => { const point = viewBoxPoint(event.nativeEvent); const pointers = activePointersRef.current; if (!pointers.has(event.pointerId)) return; pointers.set(event.pointerId, point); if (pointers.size >= 2) { const entries = [...pointers.entries()].slice(0, 2); const previous = [...pinchPreviousRef.current.entries()].slice(0, 2); if (entries.length === 2 && previous.length === 2) applyViewport(pinch(viewportRef.current, previous[0]![1], previous[1]![1], entries[0]![1], entries[1]![1], visibleBoxRef.current)); pinchPreviousRef.current = new Map(pointers); ignoreNextClick.current = true; return; } if (pointerRef.current.id !== event.pointerId) return; const dx = point[0] - pointerRef.current.x; const dy = point[1] - pointerRef.current.y; if (!pointerRef.current.moved && Math.hypot(dx, dy) > 4) { pointerRef.current.moved = true; svgRef.current?.setPointerCapture(event.pointerId); pointerRef.current.captured = true; } if (pointerRef.current.moved) applyViewport(pan(viewportRef.current, dx, dy, visibleBoxRef.current)); pointerRef.current.x = point[0]; pointerRef.current.y = point[1]; }} onPointerUp={(event) => { const pointers = activePointersRef.current; const wasPinching = pointers.size >= 2; pointers.delete(event.pointerId); if (wasPinching || pointers.size > 0) { ignoreNextClick.current = true; pinchPreviousRef.current.clear(); pointerRef.current = { id: -1, x: 0, y: 0, moved: true, captured: false }; clearIgnoredClick(); return; } if (pointerRef.current.id !== event.pointerId) return; if (pointerRef.current.captured && svgRef.current?.hasPointerCapture(event.pointerId)) svgRef.current.releasePointerCapture(event.pointerId); if (pointerRef.current.moved) { ignoreNextClick.current = true; clearIgnoredClick(); } pointerRef.current = { id: -1, x: 0, y: 0, moved: false, captured: false }; }} onPointerCancel={(event) => { const pointers = activePointersRef.current; pointers.delete(event.pointerId); pinchPreviousRef.current.clear(); if (pointerRef.current.id === event.pointerId && pointerRef.current.captured && svgRef.current?.hasPointerCapture(event.pointerId)) svgRef.current.releasePointerCapture(event.pointerId); ignoreNextClick.current = true; pointerRef.current = { id: -1, x: 0, y: 0, moved: false, captured: false }; clearIgnoredClick(); }}>
      <defs>
        <pattern id="map-dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.7" fill="#7484bc" opacity="0.22" /></pattern>
        {NODES.map((node) => <radialGradient key={node.id} id={`glow-${node.id}`}><stop offset="0" stopColor={GENRE_COLORS[node.genre]} stopOpacity="0.8" /><stop offset="1" stopColor={GENRE_COLORS[node.genre]} stopOpacity="0" /></radialGradient>)}
      </defs>
      <rect width={VIEW_W} height={VIEW_H} fill="#080b19" />
      <g ref={worldRef} className="map-world">
        <g className="map-stars">{STARS.map((star) => <circle key={`${star.x}-${star.y}`} cx={star.x} cy={star.y} r={star.r} />)}</g>
        <path className="map-grid" d={GRID_PATH} />
        <path className="map-land" d={LAND_PATH} />
        <path d={LAND_PATH} fill="url(#map-dots)" opacity="0.5" />
        {showArcs && <g>{orderedArcs.map((arc) => { const highlighted = highlightedEdgeKeys.has(arc.key) && !odyssey; const dimmed = odyssey || (selectedId !== null && !highlighted); return <path key={arc.key} className={`map-arc ${highlighted ? 'is-lineage' : ''} ${dimmed ? 'is-dim' : ''}`} style={{ '--arc-color': GENRE_COLORS[NODES.find((n) => n.id === arc.to)!.genre] } as React.CSSProperties} d={arc.d} />; })}</g>}
        {odyssey && <g>{visibleRouteArcs.map((arc) => { const current = activeRoute?.stops[odyssey.index] === arc.from || activeRoute?.stops[odyssey.index] === arc.to; return <path key={arc.key} className={`map-route-arc ${current ? 'is-current' : ''}`} style={{ '--arc-color': GENRE_COLORS[NODES.find((n) => n.id === arc.to)!.genre] } as React.CSSProperties} d={arc.d} />; })}</g>}
      <g>{orderedNodes.map((node) => {
        const [x, y] = project(node.lon, node.lat); const state = nodeTimeState(node, era, year); const highlighted = highlightedNodeIds.has(node.id); const dimmed = odyssey ? !highlighted : selectedId !== null && !highlighted; const current = odyssey && activeRoute?.stops[odyssey.index] === node.id; const showLabel = node.influence === 5 || (compact ? selectedId === node.id || isZoomed : hoveredId === node.id || selectedId === node.id || isZoomed); const label = LABEL_OFFSETS[node.id] ?? { x: 9, y: -8, anchor: 'start' as const };
        return <g key={node.id} transform={`translate(${x} ${y})`} className={`map-node-group ${dimmed ? 'is-dim' : ''} ${state === 'past' ? 'is-past' : ''} ${highlighted ? 'is-highlighted' : ''} ${current ? 'is-odyssey-current' : ''}`} onMouseEnter={() => setHovered(node.id)} onMouseLeave={() => setHovered(null)} onClick={(event) => { event.stopPropagation(); selectNode(node.id); }}>
          <g className="map-node-detail"><circle cx="0" cy="0" r={node.influence * 5 + 7} fill={`url(#glow-${node.id})`} opacity="0.45" /><circle className="map-node-core" cx="0" cy="0" r={2.2 + node.influence * 0.8} fill={GENRE_COLORS[node.genre]} /><circle className="map-node-hit" cx="0" cy="0" r={coarsePointer ? 16 : 8} />{showLabel && <text className="map-node-label" x={label.x} y={label.y} textAnchor={label.anchor}>{node.name}</text>}</g>
        </g>;
      })}</g>
      </g>
    </svg>
    <button className={`map-reset${selectedId !== null || compareOpen ? ' is-obscured' : ''}`} style={compact && resetTop !== null ? { top: resetTop } : undefined} type="button" aria-label="复位全球视角" title="复位全球视角" onClick={() => animateTo(IDENTITY)}>{compact ? '⟲' : '复位全球视角'}</button>
  </div>;
}
