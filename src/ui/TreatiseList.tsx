import { useState } from 'react';
import type { ResolvedNode, TreatiseKind } from '../domain/types';

const KIND_LABELS: Record<TreatiseKind, string> = {
  'canonical-text': '传世典籍',
  'inscription-artifact': '铭文实证',
  'oral-tradition': '口传谱系',
  'modern-record': '近现代文献',
};

export default function TreatiseList({ node }: { node: ResolvedNode }) {
  const [expanded, setExpanded] = useState(0);
  return <div className="treatise-list">
    {node.treatiseList.map((treatise, index) => {
      const panelId = `treatise-panel-${node.id}-${index}`;
      const open = expanded === index;
      return <article className={`treatise-item${open ? ' is-expanded' : ''}`} key={treatise.id}>
        <button type="button" className="treatise-toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setExpanded(open ? -1 : index)}>
          <span className="treatise-heading"><strong>{treatise.title}</strong><small>{treatise.authorEra}</small></span>
          <span className="treatise-kind">{KIND_LABELS[treatise.kind]}</span>
        </button>
        {open && <div className="treatise-detail" id={panelId}><p>{treatise.digest}</p>{treatise.excerpt ? <blockquote><b>原典金句</b><span>{treatise.excerpt}</span><cite>— {treatise.excerptSource}</cite></blockquote> : <><b className="treatise-key-label">核心记载 / 实证要点</b><p>{treatise.keyPoint}</p></>}</div>}
      </article>;
    })}
  </div>;
}
