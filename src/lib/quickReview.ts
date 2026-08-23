import type { AppState, Chapter, DeckCard } from './types';

const FRESH_CHAPTERS = new Set([
  'exploring-college',
  'learning-styles',
  'time-and-priorities',
]);

function shuffled<T>(items: T[], random: () => number): T[] {
  const output = [...items];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(random() * (index + 1));
    [output[index], output[swapWith]] = [output[swapWith], output[index]];
  }
  return output;
}

/** Build a fixed-session view over the existing per-chapter flashcard state. */
export function buildQuickReviewDeck(
  chapters: Chapter[],
  state: AppState,
  size = 10,
  random: () => number = Math.random,
): DeckCard[] {
  const all = chapters.flatMap((chapter) =>
    chapter.flashcards.map((card) => ({
      ...card,
      chapterSlug: chapter.slug,
      chapterTitle: chapter.title,
    })),
  );
  const tricky: DeckCard[] = [];
  const unfinishedStarted: DeckCard[] = [];
  const unseen: DeckCard[] = [];
  const started = new Set(
    Object.entries(state.chapters)
      .filter(
        ([, chapter]) =>
          chapter.flashcardsGotIt.length > 0 ||
          Object.keys(chapter.reviewAgainCounts).length > 0,
      )
      .map(([slug]) => slug),
  );

  for (const card of all) {
    const saved = state.chapters[card.chapterSlug];
    if (saved?.flashcardsGotIt.includes(card.id)) continue;
    const misses = saved?.reviewAgainCounts[card.id] ?? 0;
    if (misses >= 2) tricky.push(card);
    else if (started.has(card.chapterSlug)) unfinishedStarted.push(card);
    else unseen.push(card);
  }

  const fallback = started.size
    ? unseen
    : unseen.filter((card) => FRESH_CHAPTERS.has(card.chapterSlug));

  return [
    ...shuffled(tricky, random),
    ...shuffled(unfinishedStarted, random),
    ...shuffled(fallback, random),
  ].slice(0, size);
}
