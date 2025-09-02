
export type Platform = 'Instagram' | 'TikTok' | 'LinkedIn' | 'Twitter/X' | 'YouTube';
export type Tone = 'Bold' | 'Friendly' | 'Inspiring' | 'Storytelling' | 'Professional';
export type Format = 'Carousel' | 'Story' | 'Video Script' | 'Thread' | 'Post';
export type Goal = 'Virality' | 'Engagement' | 'Lead Generation' | 'Sales';
export type AspectRatio = '1:1' | '9:16';

export interface PlaybookInput {
  id: string; // e.g., 'YOUR NICHE'
  label: string;
  type: 'text' | 'textarea';
  placeholder: string;
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  category: string;
  inputs: PlaybookInput[];
  promptTemplate?: string;
}

export interface UserInputs {
  platform: Platform;
  tone: Tone;
  format: Format;
  goal: Goal;
  slideCount: number;
  aspectRatio: AspectRatio;
  watermark?: string;
  textColor: string;
  highlightColor: string;
  titleColor: string;
  // New properties
  playbookId: string;
  playbookInputs: Record<string, string>;
}

export interface ContentPart {
  partNumber: number;
  title: string;
  body: string;
  highlight?: string;
}

export interface ViralContent {
  contentParts?: ContentPart[];
  script?: string;
  postBody?: string;
  captions: string[];
  hashtags: string[];
  nextTopicSuggestion: string;
}

// New types for Analysis feature
export interface PostAnalysis {
  viralPotentialScore: {
    score: number;
    justification: string;
  };
  hookAnalysis: {
    effectiveness: 'Poor' | 'Average' | 'Good' | 'Excellent';
    feedback: string;
    suggestion: string;
  };
  contentBreakdown: {
    storytelling: string;
    valueProposition: string;
    callToAction: string;
  };
  audienceSentiment: {
    summary: string;
    positive: number;
    neutral: number;
    negative: number;
    questions: number;
  };
  growthOpportunities: string[];
  xFactor: {
    identified: boolean;
    description: string;
  };
}

// New type for Optimization feature
export interface OptimizedPart extends ContentPart {
  viralScore: number;
  rationale: string;
}

// --- PLAYBOOK DEFINITIONS ---
export const PLAYBOOKS: Playbook[] = [
  {
    id: 'default-generator',
    name: 'Standard Content Generator',
    description: 'A general-purpose generator for a variety of content types.',
    category: 'General',
    inputs: [
      { id: 'topic', label: 'Topic', type: 'textarea', placeholder: 'e.g., The truth about money' },
    ],
    // promptTemplate is handled by the old logic for this one
  },
  {
    id: 'infinite-idea-machine',
    name: 'The Infinite Idea Machine',
    description: 'Generate a unique, engaging content idea that resonates with your audience.',
    category: 'Ideation',
    promptTemplate: `You are a content strategist specializing in [YOUR NICHE]. Your task is to generate the single best and most unique, engaging content idea that will resonate with [YOUR AUDIENCE]. The idea should focus on problems my audience faces daily, trending topics in [YOUR NICHE], and actionable advice they can implement immediately. Avoid generic advice - make each idea specific and valuable.`,
    inputs: [
      { id: 'YOUR NICHE', label: 'Your Niche', type: 'text', placeholder: 'e.g., Personal Finance for Millennials' },
      { id: 'YOUR AUDIENCE', label: 'Your Audience', type: 'text', placeholder: 'e.g., Young professionals new to investing' },
    ],
  },
  {
    id: 'viral-content-creator',
    name: 'The Viral Content Concept Creator',
    description: 'Generate a concept with viral potential by tapping into strong emotions.',
    category: 'Virality',
    promptTemplate: `Generate the single best content concept with viral potential for [YOUR NICHE]. The concept should:
1. Tap into a strong emotion (surprise, inspiration, controversy, humor)
2. Be highly shareable and discussion-worthy
3. Include a clear hook for the first 3 seconds
4. Have broad appeal while staying relevant to your niche`,
    inputs: [
      { id: 'YOUR NICHE', label: 'Your Niche', type: 'text', placeholder: 'e.g., Tech startups' },
    ],
  },
  {
    id: 'contrarian-take-generator',
    name: 'The Contrarian Take Generator',
    description: 'Challenge conventional wisdom in your niche with a thoughtful, contrarian content idea.',
    category: 'Creativity',
    promptTemplate: `Take this popular opinion in [YOUR NICHE] and create a contrarian piece of content that challenges it: "[POPULAR OPINION]". For this, provide: a well-reasoned contrarian perspective, evidence or examples that support this view, a provocative title, and potential objections and how to address them. Ensure the contrarian take is thoughtful, not just controversial for attention.`,
    inputs: [
      { id: 'YOUR NICHE', label: 'Your Niche', type: 'text', placeholder: 'e.g., Fitness and nutrition' },
      { id: 'POPULAR OPINION', label: 'Popular Opinion', type: 'text', placeholder: 'e.g., "Cardio is the best way to lose weight"' },
    ],
  },
];
