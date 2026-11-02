import type { FigureId, MusicNode, PatchId } from '../domain/types';

export const PATCH_FIGURE: Record<PatchId, FigureId> = {
  'bone-flute': 'flute',
  'bronze-bells': 'bells',
  'pentatonic-pluck': 'qin',
  'ancient-lyre': 'lyre',
  'modal-drone': 'harmonic',
  'silk-ud': 'lute',
  'hydraulis-organ': 'organ',
  'baroque-harpsichord': 'organ',
  'classical-strings': 'organ',
  'polyrhythm-drums': 'rhythm',
  'swing-jazz': 'rhythm',
  'rock-distortion': 'rhythm',
  'electro-pulse': 'rhythm',
};

export const FIGURE_CAPTIONS: Record<FigureId, string> = {
  flute: '骨笛与管乐器示意',
  bells: '钟磬与金属打击乐示意',
  qin: '七弦琴与徽位示意',
  lyre: '框架式里拉琴示意',
  harmonic: '持续音与泛音结构示意',
  lute: '乌德琴与弹拨乐器示意',
  organ: '键盘、管风琴与弦乐结构示意',
  rhythm: '鼓组与节奏设备示意',
};

export function figureFor(node: Pick<MusicNode, 'patch' | 'figure'>): FigureId {
  return node.figure ?? PATCH_FIGURE[node.patch];
}
