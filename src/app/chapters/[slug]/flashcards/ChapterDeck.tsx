'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import type { Chapter } from '@/lib/types';
import { useStore } from '@/lib/storage';
import FlashcardDeck, { type DeckCard } from '@/components/FlashcardDeck';
import { useSessionDeck } from '@/lib/useSessionDeck';
import { accentStyle } from '@/lib/accent';

export default function ChapterDeck({ chapter }: { chapter: Chapter }) {
  const searchParams = useSearchParams();
  const { chapter: getState, ready, resetDeck, touch } = useStore();
  const state = getState(chapter.slug);
  const findQuery = (searchParams.get('find') ?? '').trim().toLowerCase().slice(0, 80);

  useEffect(() => {
    if (ready) touch(chapter.slug, 'flashcards');
  }, [ready, chapter.slug, touch]);

  const cards = useSessionDeck<DeckCard>(ready, `${chapter.slug}:${findQuery}`, () => {
    const gotIt = new Set(state.flashcardsGotIt);
    const available = chapter.flashcards
      .filter((c) => !gotIt.has(c.id))
      .map((c) => ({ ...c, chapterSlug: chapter.slug, chapterTitle: chapter.title }));
    if (!findQuery) return available;
    return [
      ...available.filter((card) => card.front.toLowerCase().includes(findQuery)),
      ...available.filter((card) => !card.front.toLowerCase().includes(findQuery)),
    ];
  });
  const matchingCards = findQuery
    ? cards.filter((card) => card.front.toLowerCase().includes(findQuery)).length
    : 0;

  if (!ready) {
    return <div className="h-72 animate-pulse rounded-2xl border border-line bg-surface" />;
  }

  return (
    <div
      data-accent
      style={accentStyle(chapter.themeColor, chapter.themeColorDark)}
    >
      <Link
        href={`/chapters/${chapter.slug}`}
        className="mb-3 inline-flex min-h-[44px] items-center text-sm text-body"
      >
        ← {chapter.title}
      </Link>
      <h1 className="mb-4 font-display text-xl font-semibold">Flashcards</h1>

      {matchingCards > 0 ? (
        <p className="mb-4 rounded-2xl border border-[color:var(--accent)] bg-[color:var(--accent)]/10 p-3 text-sm text-body">
          Starting with {matchingCards} card{matchingCards === 1 ? '' : 's'} that match
          {' '}“{searchParams.get('find')?.trim().slice(0, 80)}.”
        </p>
      ) : null}

      <FlashcardDeck
        cards={cards}
        title={chapter.title}
        onReset={() => resetDeck(chapter.slug)}
        emptyMessage="You’ve marked every card in this chapter as “Got it.” Reset the deck from the chapter page to go through them again."
        onDoneHref={[
          { href: `/chapters/${chapter.slug}/reflect`, label: 'Try the reflections' },
          { href: `/chapters/${chapter.slug}`, label: 'Back to chapter' },
        ]}
      />
    </div>
  );
}
