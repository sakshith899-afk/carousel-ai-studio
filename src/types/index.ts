export type Tone = 'professional' | 'playful' | 'bold' | 'educational' | 'inspirational';
export type TimeRange = '24h' | '7d' | '30d' | 'custom';
export type ImageStyle = 'editorial' | 'minimal' | '3d' | 'illustration' | 'photography';
export type GenerationStatus = 'pending' | 'researching' | 'writing' | 'designing' | 'completed' | 'error';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export const DEFAULT_PALETTE: ColorPalette = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#ec4899',
  background: '#0f172a',
  text: '#f8fafc',
};

export interface UserBrief {
  topic: string;
  timeRange: TimeRange;
  customTimeRange?: string;
  audience: string;
  brandName: string;
  tone: Tone;
  palette: ColorPalette;
  generateImages: boolean;
  imageStyle: ImageStyle;
  ctaGoal: string;
}

export interface ResearchSource {
  title: string;
  url: string;
  date: string;
  snippet: string;
  credibility: 'high' | 'medium' | 'low';
}

export interface ResearchOutput {
  keyInsights: string[];
  facts: Array<{ stat: string; source: string }>;
  sources: ResearchSource[];
  summary: string;
  generatedAt: string;
}

export type SlideRole =
  | 'hook'
  | 'context'
  | 'insight1'
  | 'insight2'
  | 'insight3'
  | 'takeaway'
  | 'cta';

export interface Slide {
  index: number;
  role: SlideRole;
  title: string;
  body: string;
  imagePrompt?: string;
  imageUrl?: string;
  backgroundColor?: string;
}

export interface CopyOutput {
  slides: Slide[];
  caption: string;
  hashtags: string[];
  altTexts: string[];
  generatedAt: string;
}

export interface GenerationRun {
  id: string;
  brief: UserBrief;
  status: GenerationStatus;
  progress: number;
  currentStage: string;
  research?: ResearchOutput;
  copy?: CopyOutput;
  error?: string;
  createdAt: string;
  updatedAt: string;
}
