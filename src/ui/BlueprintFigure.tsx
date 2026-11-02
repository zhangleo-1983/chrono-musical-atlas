import type { ResolvedNode } from '../domain/types';
import { commonsSearchUrl, FIGURE_CAPTIONS, figureFor } from './figures';

interface BlueprintFigureProps { node: ResolvedNode; resonating: boolean }

function FigureDrawing({ figure }: { figure: ReturnType<typeof figureFor> }) {
  if (figure === 'flute') return <><path d="M58 104h260M82 104V82m34 22V72m34 32V82m34 22V68m34 36V80m34 24V74" /><path className="resonance" d="M68 128c54 22 190 22 244 0" /></>;
  if (figure === 'bells') return <><path d="M68 120h264M95 120V78c0-24 34-24 34 0v42m70 0V60c0-28 38-28 38 0v60m38 0V78c0-24 34-24 34 0v42" /><path className="resonance" d="M92 52c18-13 28-13 42 0m59-13c22-17 39-17 60 0m36 13c18-13 28-13 42 0" /></>;
  if (figure === 'qin') return <><path d="M62 108c12-34 42-54 90-54h86c48 0 78 20 100 54l-15 12H78zM88 96h210M112 81h160" /><path className="resonance" d="M130 116c32-12 74-12 106 0" /></>;
  if (figure === 'lyre') return <><path d="M92 128V74c0-22 26-42 48-42M308 128V74c0-22-26-42-48-42M140 32c22 22 98 22 120 0M92 128h216" /><path className="resonance" d="M132 64h136M132 82h136M132 100h136" /></>;
  if (figure === 'lute') return <><path d="M70 116c0-38 45-58 92-36 42 20 58 14 78-8l54-54M70 116c0 32 66 36 88 3 16-24 21-28 50-27M290 18l28 28" /><path className="resonance" d="M105 91c17-18 44-19 61-4 17 15 14 35-5 43" /></>;
  if (figure === 'organ') return <><path d="M80 128V62h44v66M138 128V42h44v86M196 128V24h44v104M254 128V50h44v78M68 128h240M92 142h216" /><path className="resonance" d="M92 54c22-15 44-15 66 0m20-14c22-15 44-15 66 0m20 20c18-12 36-12 54 0" /></>;
  if (figure === 'rhythm') return <><path d="M70 128h260M96 128V82h44v46m34 0V64h44v64m34 0V78h44v50M92 54h52m16 0h52m16 0h52" /><path className="resonance" d="M76 44c18-18 34-18 50 0m74 0c18-18 34-18 50 0m64 0c14-14 27-14 40 0" /></>;
  if (figure === 'harmonic') return <><path d="M78 128h246M108 128V88h42m-21 0V54m72 74V72h42m-21 0V42m72 86V62h42m-21 0V30" /><path className="resonance" d="M108 42h42m-21 0v12m51 18h42m-21 0v-30m51 42h42m-21 0v-32" /><text x="108" y="145" fill="currentColor" stroke="none" fontSize="12">1:2</text><text x="180" y="145" fill="currentColor" stroke="none" fontSize="12">2:3</text><text x="252" y="145" fill="currentColor" stroke="none" fontSize="12">3:4</text></>;
  return <><path d="M76 128h248M112 128V80h48v48m80 0V64h48v64" /><path className="resonance" d="M92 48h216" /></>;
}

export default function BlueprintFigure({ node, resonating }: BlueprintFigureProps) {
  const figure = figureFor(node);
  return <figure className={`blueprint-figure${resonating ? ' is-resonating' : ''}`}>
    <div className="blueprint-head"><figcaption>{FIGURE_CAPTIONS[figure]}</figcaption><a href={commonsSearchUrl(node)} target="_blank" rel="noopener noreferrer">🖼️ 博物图鉴实拍 ↗</a></div>
    <svg className="blueprint-svg" viewBox="0 0 400 180" role="img" aria-label={FIGURE_CAPTIONS[figure]}><g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M42 148h316" stroke="var(--gilt)" opacity=".55" /><FigureDrawing figure={figure} /></g></svg>
  </figure>;
}
