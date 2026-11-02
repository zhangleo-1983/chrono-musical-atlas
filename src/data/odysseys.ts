import type { OdysseyRoute } from '../domain/types';

export const ODYSSEYS: OdysseyRoute[] = [
  {
    id: 'origins-across-civilizations',
    title: '人类音乐创世记：跨文明源头巡礼',
    stops: ['jiahu-flute', 'sumer-lyre', 'vedic-chant', 'andean-chavin', 'zenghouyi-bells'],
  },
  {
    id: 'mesopotamia-to-aegean',
    title: '从两河到爱琴海：西方调式与圣咏之源',
    stops: ['sumer-lyre', 'egypt-temple', 'hurrian-hymn', 'hebrew-temple', 'greek-modes', 'roman-hydraulis', 'gregorian-chant'],
  },
  {
    id: 'east-asian-ritual-silk-road',
    title: '华夏礼乐与丝路东传：东方音律星河',
    stops: ['jiahu-flute', 'zhou-ritual', 'zenghouyi-bells', 'persian-silkroad', 'han-wei-yuefu', 'gagaku'],
  },
];
