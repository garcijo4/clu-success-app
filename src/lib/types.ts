// Content model for the College Success Companion.
// See design plan §3.3.

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  section?: string;
}

export interface DeckCard extends Flashcard {
  /** Which chapter this card belongs to — mixed decks span chapters. */
  chapterSlug: string;
  chapterTitle: string;
}

export interface LikertItem {
  id: string;
  text: string;
}

export interface ResultBand {
  min: number;
  max: number;
  label: string;
  advice: string;
}

export type AssessmentKind = 'likert' | 'reflection' | 'checklist';

export interface Assessment {
  id: string;
  title: string;
  kind: AssessmentKind;
  estMinutes: number;
  intro: string;
  items: LikertItem[];
  prompt?: string;
  resultBands?: ResultBand[];
}

export interface Chapter {
  slug: string;
  number: number;
  title: string;
  studentSubtitle: string;
  themeColor: string;
  themeColorDark: string;
  blurb: string;
  keyIdeas: string[];
  sections: string[];
  openstaxUrl: string;
  flashcards: Flashcard[];
  assessments: Assessment[];
}

// ---- Persisted state (design plan §6) ----

export interface AssessmentState {
  completedAt?: string;
  likertAnswers?: Record<string, number>;
  reflectionText?: string;
  reflectionUpdatedAt?: string;
  checklist?: string[];
}

export interface ChapterState {
  flashcardsGotIt: string[];
  reviewAgainCounts: Record<string, number>;
  assessments: Record<string, AssessmentState>;
}

export type ThemeSetting = 'system' | 'light' | 'dark';

export interface AppState {
  version: 1;
  welcomed?: boolean;
  theme?: ThemeSetting;
  lastVisited?: {
    chapterSlug: string;
    activity: 'flashcards' | 'reflect';
    at: string;
  };
  chapters: Record<string, ChapterState>;
}
