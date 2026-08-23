'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { chapters } from '@/content';
import { useStore } from '@/lib/storage';
import { buildQuickReviewDeck } from '@/lib/quickReview';
import { useSessionDeck } from '@/lib/useSessionDeck';
import { accentStyle } from '@/lib/accent';
import FlashcardDeck, { type DeckCard } from '@/components/FlashcardDeck';

const SIZE = 10;

export default function QuickReviewPage() {
  const { state, ready } = useStore();

  const cards = useSessionDeck<DeckCard>(ready, 'quick-review', () =>
    buildQuickReviewDeck(chapters, state, SIZE),
  );

  const chapterChips = useMemo(() => {
    const names = new Map<string, string>();
    cards.forEach((c) => names.set(c.chapterSlug, c.chapterTitle));
    return Array.from(names.entries());
  }, [cards]);

  if (!ready) {
    return <div className="h-72 animate-pulse rounded-2xl border border-line bg-surface" />;
  }

  return (
    <div
      data-accent
      style={accentStyle('#3B2360', '#FFC222')}
    >
      <Link href="/" className="mb-3 inline-flex min-h-[44px] items-center text-sm text-body">
        ← Home
      </Link>
      <h1 className="font-display text-xl font-semibold">Quick Review</h1>
      <p className="mb-4 text-sm text-body">
        {SIZE} cards picked for you — about five minutes.
      </p>

      {chapterChips.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {chapterChips.map(([slug, title]) => (
            <span
              key={slug}
              className="rounded-full border border-line px-2.5 py-1 text-xs text-body"
            >
              {title}
            </span>
          ))}
        </div>
      )}

      <FlashcardDeck
        cards={cards}
        title="Quick Review"
        showShuffle={false}
        emptyMessage="You’ve reviewed everything for now. Nice work — try resetting a chapter deck if you want another pass."
        onDoneHref={[{ href: '/', label: 'Back to home' }]}
      />
    </div>
  );
}
