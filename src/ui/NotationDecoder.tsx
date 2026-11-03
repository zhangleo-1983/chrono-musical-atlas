import { useMemo, useState } from 'react';
import { audioEngine } from '../audio/engine';
import { PATCHES } from '../audio/patches';
import { useAudioState } from '../audio/useAudioState';
import type { Motif, ResolvedNode, Voice } from '../domain/types';

const BASIS_LABELS = {
  'surviving-score': '存世乐谱',
  'theory-system': '理论体系',
  'later-system': '后世记谱',
} as const;

function nodeVoice(node: ResolvedNode): Voice {
  return PATCHES[node.patch].events.find((event) => event.midi !== undefined)?.voice ?? PATCHES[node.patch].events[0]?.voice ?? 'pluck';
}

export default function NotationDecoder({ node }: { node: ResolvedNode }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const { playingKey } = useAudioState();
  const notation = node.notation;
  const voice = useMemo(() => nodeVoice(node), [node]);
  if (!notation) return <section className="notation-absent"><strong>本轮不设破译台</strong><p>{node.notationAbsentNote}</p></section>;
  const sequenceKey = `notation:${node.id}`;
  const sequencePlaying = playingKey === sequenceKey;
  const activeIndex = activeStep ?? selected;
  const playSingle = (index: number) => {
    const glyph = notation.glyphs[index];
    if (!glyph) return;
    if (sequencePlaying) audioEngine.stop();
    setSelected(index);
    setActiveStep(null);
    void audioEngine.playNote(`glyph:${node.id}:${index}`, glyph.midi, voice);
  };
  const playSequence = () => {
    if (sequencePlaying) { audioEngine.stop(); setActiveStep(null); return; }
    const motif: Motif = { bpm: 84, stepsPerBeat: 1, voice, wet: 0.12, events: notation.glyphs.map((glyph, index) => ({ step: index, midi: glyph.midi, durSteps: 1, vel: 0.62 })) };
    void audioEngine.playMotif(sequenceKey, motif, { onStep: (index) => { setActiveStep(index); setSelected(index); }, onEnd: () => setActiveStep(null) });
  };
  return <section className="notation-decoder">
    <div className="notation-head"><h3>{notation.system}</h3><button type="button" className="notation-play" onClick={playSequence}>{sequencePlaying ? '■ 停止' : '▶ 顺序连奏'}</button></div>
    <p className="notation-era">{notation.eraNote}</p>
    <div className="notation-meta"><span>{BASIS_LABELS[notation.basis]}</span><span>{notation.source}</span><span>参考：{notation.referenceKey}</span></div>
    <div className="notation-glyph-grid" role="list" aria-label="记谱符号">
      {notation.glyphs.map((glyph, index) => <button type="button" role="listitem" className={`notation-glyph${activeIndex === index ? ' is-selected' : ''}`} key={`${glyph.symbol}-${index}`} aria-pressed={selected === index} onClick={() => playSingle(index)}><strong>{glyph.symbol}</strong><small>{glyph.modern}</small></button>)}
    </div>
    {activeIndex !== null && notation.glyphs[activeIndex] && <div className="notation-meaning"><span>当前符号</span><strong>{notation.glyphs[activeIndex]!.symbol} · {notation.glyphs[activeIndex]!.modern}</strong><p>{notation.glyphs[activeIndex]!.meaning}</p></div>}
  </section>;
}
