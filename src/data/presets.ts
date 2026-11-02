import type { ComparePreset } from '../domain/types';

export const PRESETS: ComparePreset[] = [
  { id: 'vienna-vs-new-orleans', label: '古典秩序 × 爵士即兴', a: 'vienna-classical', b: 'new-orleans-jazz' },
  { id: 'zhou-vs-paris', label: '五声古意 × 印象音色', a: 'zhou-ritual', b: 'paris-impressionism' },
  { id: 'detroit-vs-griot', label: '机器循环 × 口述节奏', a: 'detroit-techno', b: 'griot-mali' },
  { id: 'bach-vs-tokyo', label: '复调建筑 × 电子城市', a: 'leipzig-baroque', b: 'tokyo-electro' },
  { id: 'bells-vs-greek', label: '金石天道 × 数理宇宙', a: 'zenghouyi-bells', b: 'greek-modes' },
  { id: 'hurrian-vs-zhou', label: '泥板记谱 × 礼乐琴道', a: 'hurrian-hymn', b: 'zhou-ritual' },
  { id: 'hanwei-vs-hebrew', label: '琴道风骨 × 圣殿轮唱', a: 'han-wei-yuefu', b: 'hebrew-temple' },
];
