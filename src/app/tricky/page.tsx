'use client';

import Link from 'next/link';
import { chapters } from '@/content';
import { useStore } from '@/lib/storage';
import { useSessionDeck } from '@/lib/useSessionDeck';
import { accentStyle } from '@/lib/accent';
import FlashcardDeck, { type DeckCard } from '@/components/FlashcardDeck';

export default function TrickyPage() {
  const { state, ready } = useStore();

  const cards = useSessionDeck<DeckCard>(ready, 'tricky-cards', () => {
    const out: DeckCard[] = [];
    for (const ch of chapters) {
      const s = state.chapters[ch.slug];
      if (!s) continue;
      for (const card of ch.flashcards) {
        const misses = s.reviewAgainCounts?.[card.id] ?? 0;
        if (misses >= 2 && !s.flashcardsGotIt.includes(card.id)) {
          out.push({ ...card, chapterSlug: ch.slug, chapterTitle: ch.title });
        }
      }
    }
    return out;
  });

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
      <h1 className="font-display text-xl font-semibold">Tricky cards</h1>
      <p className="mb-4 text-sm text-body">
        The cards you keep coming back to — worth one more look.
      </p>

      <FlashcardDeck
        cards={cards}
        title="Tricky cards"
        showShuffle={false}
        emptyMessage="Nothing here right now. Cards land here when you send them back for review a couple of times."
        askPrefix={(card) =>
          `I keep forgetting "${card.front}" — can you explain it a different way with an example?`
        }
        onDoneHref={[{ href: '/', label: 'Back to home' }]}
      />
    </div>
  );
}
