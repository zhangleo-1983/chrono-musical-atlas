import { useState } from 'react';
import { audioEngine } from '../audio/engine';
import { useAudioState } from '../audio/useAudioState';
import type { ResolvedNode, WorkItem } from '../domain/types';

function streamingLinks(work: WorkItem) {
  const query = encodeURIComponent(work.searchQuery);
  return {
    spotify: `https://open.spotify.com/search/${query}`,
    youtube: `https://www.youtube.com/results?search_query=${query}`,
  };
}

export default function RepertoireList({ node }: { node: ResolvedNode }) {
  const [expanded, setExpanded] = useState(0);
  const { playingKey } = useAudioState();
  return <div className="repertoire-list">
    {node.repertoire.map((work, index) => {
      const playKey = `work:${node.id}:${work.id}`;
      const playing = playingKey === playKey;
      const links = streamingLinks(work);
      return <article className={`repertoire-item${expanded === index ? ' is-expanded' : ''}`} key={work.id}>
        <div className="repertoire-summary">
          <button type="button" className="repertoire-toggle" aria-expanded={expanded === index} onClick={() => setExpanded(expanded === index ? -1 : index)}>
            <span className="repertoire-title">{work.title}</span><span className="repertoire-subtitle">{work.subtitle}</span>
          </button>
          <div className="repertoire-actions">
            {work.motif && <><span className="motif-badge">{work.motifKind === 'theme' ? '主题' : '风格示意'}</span><button type="button" className="motif-button" onClick={() => playing ? audioEngine.stop() : void audioEngine.playMotif(playKey, work.motif!)}>{playing ? '■ 停止' : '▶ 试听'}</button></>}
            {!work.publicDomain && <a className="licensed-link" href={links.spotify} target="_blank" rel="noopener noreferrer">正版聆听 ↗</a>}
          </div>
        </div>
        {expanded === index && <div className="repertoire-detail">
          <p>{work.guide}</p>
          {!work.publicDomain && <p className="repertoire-note is-warning">该作品受现代著作权保护，本站仅提供导赏与正版流媒体入口。</p>}
          {work.motifKind === 'evocation' && <p className="repertoire-note">按该传统常用音阶创作的示意乐句，并非原曲。</p>}
          <div className="repertoire-links"><a href={links.spotify} target="_blank" rel="noopener noreferrer">Spotify 搜索 ↗</a><a href={links.youtube} target="_blank" rel="noopener noreferrer">YouTube 搜索 ↗</a></div>
        </div>}
      </article>;
    })}
  </div>;
}
