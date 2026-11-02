import { NODES, ODYSSEYS } from '../data';
import { useAtlasStore } from '../store/atlasStore';

export default function OdysseyBar() {
  const { odyssey, startOdyssey, gotoStop, nextStop, prevStop, exitOdyssey } = useAtlasStore();
  const route = odyssey ? ODYSSEYS.find((candidate) => candidate.id === odyssey.routeId) : undefined;
  if (!route || !odyssey) {
    return <div className="odyssey-bar" aria-label="文明巡礼"><span className="odyssey-label">文明巡礼</span><div className="odyssey-route-list">{ODYSSEYS.map((candidate) => <button key={candidate.id} type="button" title={candidate.title} onClick={() => startOdyssey(candidate.id)}>{candidate.title}</button>)}</div></div>;
  }
  const stopId = route.stops[odyssey.index];
  const stopName = stopId ? NODES.find((node) => node.id === stopId)?.name ?? stopId : '';
  return <div className="odyssey-bar is-active" aria-label={route.title}><div className="odyssey-active-heading"><span className="eyebrow">文明巡礼</span><strong title={route.title}>{route.title}</strong></div><span className="odyssey-progress">第 {odyssey.index + 1} / {route.stops.length} 站 · {stopName}</span><div className="odyssey-dots">{route.stops.map((id, index) => <button key={id} type="button" className={index === odyssey.index ? 'is-current' : ''} aria-label={`跳转到第 ${index + 1} 站`} aria-current={index === odyssey.index ? 'step' : undefined} onClick={() => gotoStop(index)} />)}</div><div className="odyssey-controls"><button type="button" onClick={prevStop} disabled={odyssey.index === 0}>← 上一站</button><button type="button" onClick={nextStop} disabled={odyssey.index === route.stops.length - 1}>下一站 →</button><button type="button" onClick={exitOdyssey}>退出巡礼 ×</button></div></div>;
}
