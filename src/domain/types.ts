export type EraId = 'ancient' | 'medieval' | 'baroque' | 'romantic' | 'modern' | 'contemporary';
export type GenreId = 'ritual' | 'classical' | 'folk' | 'blues_jazz' | 'rock_pop' | 'electronic';
export type Continent = 'asia' | 'europe' | 'africa' | 'americas';
export type PatchId = 'pentatonic-pluck' | 'modal-drone' | 'polyrhythm-drums' | 'baroque-harpsichord' | 'classical-strings' | 'swing-jazz' | 'rock-distortion' | 'electro-pulse' | 'bone-flute' | 'bronze-bells' | 'ancient-lyre' | 'silk-ud' | 'hydraulis-organ';
export type FigureId = 'flute' | 'bells' | 'qin' | 'lyre' | 'harmonic' | 'lute' | 'organ' | 'rhythm';

export interface Radar { rhythm: number; harmony: number; improvisation: number; ensemble: number; fusion: number }
export interface Musician { name: string; nameEn: string; lifespan: string; knownFor: string }
export interface MusicNode {
  id: string; name: string; nameEn: string; startYear: number; endYear: number | null;
  city: string; region: string; continent: Continent; lat: number; lon: number; genre: GenreId;
  influence: 1 | 2 | 3 | 4 | 5; musicians: Musician[]; works: string[]; instruments: string[];
  traits: string[]; summary: string; artifact: string; tuningSystem: string; institution: string; treatises: string[]; story: string;
  searchQuery?: string; imageQuery?: string; figure?: FigureId; radar: Radar; patch: PatchId; influencedBy: string[];
}
export interface ResolvedNode extends MusicNode { era: EraId; influences: string[] }
export interface ComparePreset { id: string; label: string; a: string; b: string }
export interface OdysseyRoute { id: string; title: string; stops: string[] }
