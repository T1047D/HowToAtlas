export type Language = 'en' | 'bn';

export interface BilingualText {
  en: string;
  bn: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'practical';

export type CategoryId =
  | 'web-hosting'
  | 'digital-safety'
  | 'productivity'
  | 'media-optimization';

export interface CategoryMeta {
  id: CategoryId;
  label: BilingualText;
  description: BilingualText;
}

export interface GuideStep {
  id: string;
  title: BilingualText;
  instruction: BilingualText;
  screenshot?: string;
  screenshotCaption?: BilingualText;
  tip?: BilingualText;
}

export interface CommonMistake {
  id: string;
  mistake: BilingualText;
  fix: BilingualText;
}

export interface Guide {
  id: string;
  slug: string;
  category: CategoryId;
  difficulty: DifficultyLevel;
  readTimeMinutes: number;
  updatedAt: string;
  views: number;
  popular: boolean;
  coverImage: string;
  title: BilingualText;
  summary: BilingualText;
  videoUrl?: string;
  videoTitle?: BilingualText;
  prerequisites: BilingualText[];
  steps: GuideStep[];
  commonMistakes: CommonMistake[];
  relatedIds: string[];
}

export interface AtlasDataset {
  version: string;
  updatedAt: string;
  guides: Guide[];
}
