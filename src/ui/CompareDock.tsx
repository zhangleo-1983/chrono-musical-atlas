import { NODE_BY_ID, PRESETS } from '../data';
import { useAtlasStore } from '../store/atlasStore';
import './hud.css';

export default function CompareDock() {
  const { compare, addToCompare, removeFromCompare, loadPreset, setCompareOpen } = useAtlasStore(); const [a, b] = compare;
  const choosePreset = (preset: typeof PRESETS[number]) => { loadPreset(preset); setCompareOpen(true); };
  return <section className="compare-dock" aria-label="对比托盘"><div className="compare-slots"><div className="compare-slot"><span>A</span>{a ? <><strong>{NODE_BY_ID.get(a)?.name}</strong><button type="button" aria-label="移除 A" onClick={() => removeFromCompare(0)}>×</button></> : <em>选择一个节点</em>}</div><div className="compare-slot"><span>B</span>{b ? <><strong>{NODE_BY_ID.get(b)?.name}</strong><button type="button" aria-label="移除 B" onClick={() => removeFromCompare(1)}>×</button></> : <em>选择另一个节点</em>}</div><button type="button" className="compare-open" disabled={!a || !b} onClick={() => setCompareOpen(true)}>展开深度对比</button></div><div className="preset-list">{PRESETS.map((preset) => <button type="button" key={preset.id} onClick={() => choosePreset(preset)}>{preset.label}</button>)}</div></section>;
}
