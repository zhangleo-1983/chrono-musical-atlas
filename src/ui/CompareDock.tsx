import { useEffect, useState } from 'react';
import { NODE_BY_ID, PRESETS } from '../data';
import { useAtlasStore } from '../store/atlasStore';
import './hud.css';

export default function CompareDock() {
  const { compare, selectedId, compareOpen, removeFromCompare, loadPreset, setCompareOpen, selectNode } = useAtlasStore(); const [a, b] = compare; const [expanded, setExpanded] = useState(false);
  useEffect(() => { if (selectedId || compareOpen) setExpanded(false); }, [compareOpen, selectedId]);
  const openCompare = () => { selectNode(null); setExpanded(false); setCompareOpen(true); };
  const choosePreset = (preset: typeof PRESETS[number]) => { selectNode(null); setExpanded(false); loadPreset(preset); setCompareOpen(true); };
  return <section className={`compare-dock${expanded ? ' is-expanded' : ''}`} aria-label="对比托盘"><button type="button" className="compare-toggle" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>对比 {Number(Boolean(a)) + Number(Boolean(b))}/2</button><div className="compare-content"><button type="button" className="compare-collapse" aria-label="收起对比托盘" onClick={() => setExpanded(false)}>×</button><div className="compare-slots"><div className="compare-slot"><span>A</span>{a ? <><strong>{NODE_BY_ID.get(a)?.name}</strong><button type="button" aria-label="移除 A" onClick={() => removeFromCompare(0)}>×</button></> : <em>选择一个节点</em>}</div><div className="compare-slot"><span>B</span>{b ? <><strong>{NODE_BY_ID.get(b)?.name}</strong><button type="button" aria-label="移除 B" onClick={() => removeFromCompare(1)}>×</button></> : <em>选择另一个节点</em>}</div><button type="button" className="compare-open" disabled={!a || !b} onClick={openCompare}>展开深度对比</button></div><div className="preset-list">{PRESETS.map((preset) => <button type="button" key={preset.id} onClick={() => choosePreset(preset)}>{preset.label}</button>)}</div></div></section>;
}
