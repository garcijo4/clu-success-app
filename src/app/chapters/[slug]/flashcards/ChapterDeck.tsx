'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import type { Chapter } from '@/lib/types';
import { useStore } from '@/lib/storage';
import FlashcardDeck, { type DeckCard } from '@/components/FlashcardDeck';
import { useSessionDeck } from '@/lib/useSessionDeck';
import { accentStyle } from '@/lib/accent';

export default function ChapterDeck({ chapter }: { chapter: Chapter }) {
  const { chapter: getState, ready, resetDeck, touch } = useStore();
  const state = getState(chapter.slug);

  useEffect(() => {
    if (ready) touch(chapter.slug, 'flashcards');
  }, [ready, chapter.slug, touch]);

  const cards = useSessionDeck<DeckCard>(ready, chapter.slug, () => {
    const gotIt = new Set(state.flashcardsGotIt);
    return chapter.flashcards
      .filter((c) => !gotIt.has(c.id))
      .map((c) => ({ ...c, chapterSlug: chapter.slug, chapterTitle: chapter.title }));
  });

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
