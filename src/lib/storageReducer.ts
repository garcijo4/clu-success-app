import type {
  AppState,
  AssessmentState,
  ChapterState,
  ThemeSetting,
} from './types';

export type StorageAction =
  | { type: 'mark-got-it'; slug: string; cardId: string }
  | { type: 'mark-review-again'; slug: string; cardId: string }
  | { type: 'reset-deck'; slug: string }
  | {
      type: 'save-assessment';
      slug: string;
      assessmentId: string;
      patch: Partial<AssessmentState>;
    }
  | { type: 'touch'; slug: string; activity: 'flashcards' | 'reflect'; at: string }
  | { type: 'set-theme'; theme: ThemeSetting }
  | { type: 'set-welcomed' };

const THEMES = new Set<ThemeSetting>(['system', 'light', 'dark']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? Array.from(new Set(value.filter((item): item is string => typeof item === 'string')))
    : [];
}

function reviewCounts(value: unknown): Record<string, number> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, number] =>
        typeof entry[1] === 'number' &&
        Number.isFinite(entry[1]) &&
        entry[1] >= 0,
    ),
  );
}

function assessmentState(value: unknown): AssessmentState {
  if (!isRecord(value)) return {};
  const normalized: AssessmentState = {};
  if (typeof value.completedAt === 'string') normalized.completedAt = value.completedAt;
  if (typeof value.reflectionText === 'string') {
    normalized.reflectionText = value.reflectionText;
  }
  if (typeof value.reflectionUpdatedAt === 'string') {
    normalized.reflectionUpdatedAt = value.reflectionUpdatedAt;
  }
  if (isRecord(value.likertAnswers)) {
    normalized.likertAnswers = Object.fromEntries(
      Object.entries(value.likertAnswers).filter(
        (entry): entry is [string, number] =>
          typeof entry[1] === 'number' &&
          Number.isInteger(entry[1]) &&
          entry[1] >= 1 &&
          entry[1] <= 5,
      ),
    );
  }
  if (Array.isArray(value.checklist)) normalized.checklist = stringArray(value.checklist);
  return normalized;
}

export function emptyChapterState(): ChapterState {
  return { flashcardsGotIt: [], reviewAgainCounts: {}, assessments: {} };
}

export function emptyAppState(): AppState {
  return { version: 1, chapters: {} };
}

/**
 * Treat localStorage as untrusted input. A value can be valid JSON but still
 * have missing or wrongly typed nested fields after a partial write or manual edit.
 */
export function normalizeAppState(value: unknown): AppState {
  if (!isRecord(value) || value.version !== 1) return emptyAppState();

  const chapters: Record<string, ChapterState> = {};
  if (isRecord(value.chapters)) {
    for (const [slug, candidate] of Object.entries(value.chapters)) {
      if (!isRecord(candidate)) continue;
      const assessments: Record<string, AssessmentState> = {};
      if (isRecord(candidate.assessments)) {
        for (const [id, saved] of Object.entries(candidate.assessments)) {
          assessments[id] = assessmentState(saved);
        }
      }
      chapters[slug] = {
        flashcardsGotIt: stringArray(candidate.flashcardsGotIt),
        reviewAgainCounts: reviewCounts(candidate.reviewAgainCounts),
        assessments,
      };
    }
  }

  const state: AppState = { version: 1, chapters };
  if (typeof value.welcomed === 'boolean') state.welcomed = value.welcomed;
  if (typeof value.theme === 'string' && THEMES.has(value.theme as ThemeSetting)) {
    state.theme = value.theme as ThemeSetting;
  }
  if (
    isRecord(value.lastVisited) &&
    typeof value.lastVisited.chapterSlug === 'string' &&
    (value.lastVisited.activity === 'flashcards' || value.lastVisited.activity === 'reflect') &&
    typeof value.lastVisited.at === 'string'
  ) {
    state.lastVisited = {
      chapterSlug: value.lastVisited.chapterSlug,
      activity: value.lastVisited.activity,
      at: value.lastVisited.at,
    };
  }
  return state;
}

/** A truncated/corrupted value is recoverable; it does not mean storage is blocked. */
export function parseStoredState(raw: string | null): AppState {
  if (!raw) return emptyAppState();
  try {
    return normalizeAppState(JSON.parse(raw));
  } catch {
    return emptyAppState();
  }
}

function withChapter(
  state: AppState,
  slug: string,
  update: (chapter: ChapterState) => ChapterState,
): AppState {
  return {
    ...state,
    chapters: {
      ...state.chapters,
      [slug]: update(state.chapters[slug] ?? emptyChapterState()),
    },
  };
}

export function storageReducer(state: AppState, action: StorageAction): AppState {
  switch (action.type) {
    case 'mark-got-it':
      return withChapter(state, action.slug, (chapter) => {
        const counts = { ...chapter.reviewAgainCounts };
        delete counts[action.cardId];
        return {
          ...chapter,
          flashcardsGotIt: chapter.flashcardsGotIt.includes(action.cardId)
            ? chapter.flashcardsGotIt
            : [...chapter.flashcardsGotIt, action.cardId],
          reviewAgainCounts: counts,
        };
      });
    case 'mark-review-again':
      return withChapter(state, action.slug, (chapter) => ({
        ...chapter,
        flashcardsGotIt: chapter.flashcardsGotIt.filter((id) => id !== action.cardId),
        reviewAgainCounts: {
          ...chapter.reviewAgainCounts,
          [action.cardId]: (chapter.reviewAgainCounts[action.cardId] ?? 0) + 1,
        },
      }));
    case 'reset-deck':
      return withChapter(state, action.slug, (chapter) => ({
        ...chapter,
        flashcardsGotIt: [],
        reviewAgainCounts: {},
      }));
    case 'save-assessment':
      return withChapter(state, action.slug, (chapter) => ({
        ...chapter,
        assessments: {
          ...chapter.assessments,
          [action.assessmentId]: {
            ...chapter.assessments[action.assessmentId],
            ...action.patch,
          },
        },
      }));
    case 'touch':
      return {
        ...state,
        lastVisited: {
          chapterSlug: action.slug,
          activity: action.activity,
          at: action.at,
        },
      };
    case 'set-theme':
      return { ...state, theme: action.theme };
    case 'set-welcomed':
      return { ...state, welcomed: true };
  }
}
