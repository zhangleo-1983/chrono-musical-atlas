import { useState } from 'react';
import type { ResolvedNode } from '../domain/types';

export default function MusicianList({ node }: { node: ResolvedNode }) {
  const [expanded, setExpanded] = useState(0);
  return <div className="musician-list">
    {node.musicians.map((musician, index) => {
      const panelId = `musician-panel-${node.id}-${index}`;
      const open = expanded === index;
      return <article className={`musician-item${open ? ' is-expanded' : ''}`} key={musician.name}>
        <button type="button" className="musician-toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setExpanded(open ? -1 : index)}>
          <span className="musician-heading"><strong>{musician.name}</strong><small>{musician.nameEn} · {musician.lifespan}</small></span>
          <span className="musician-known-for">{musician.knownFor}</span>
        </button>
        {open && <div className="musician-detail" id={panelId}><p>{musician.bio}</p><p className="musician-legacy"><b>历史印记</b>{musician.legacy}</p></div>}
      </article>;
    })}
  </div>;
}
