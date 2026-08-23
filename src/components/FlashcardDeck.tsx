'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { DeckCard } from '@/lib/types';
import { useStore } from '@/lib/storage';
import { useSpeech } from '@/lib/speech';
import AskAboutThis from './AskAboutThis';

export type { DeckCard } from '@/lib/types';

interface Props {
  cards: DeckCard[];
  title: string;
  /** Shown when every card has been marked "Got it". */
  onDoneHref?: { href: string; label: string }[];
  emptyMessage?: string;
  askPrefix?: (card: DeckCard) => string;
  showShuffle?: boolean;
  onReset?: () => void;
}

function shuffleArray<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function FlashcardDeck({
  cards,
  title,
  onDoneHref = [],
  emptyMessage = 'No cards here right now.',
  askPrefix,
  showShuffle = true,
  onReset,
}: Props) {
  const { markGotIt, markReviewAgain } = useStore();
  const speech = useSpeech();
  const faceDescriptionId = useId();

  const [shuffled, setShuffled] = useState(false);
  const [queue, setQueue] = useState<DeckCard[]>(cards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [announce, setAnnounce] = useState('');
  const startedWith = useRef(cards.length);

  // Reset when the incoming deck changes identity (e.g. new chapter).
  useEffect(() => {
    setQueue(cards);
    setIndex(0);
    setFlipped(false);
    startedWith.current = cards.length;
  }, [cards]);

  const card = queue[index];

  // Never let an utterance outlive the card that started it.
  useEffect(() => {
    speech.stop();
  }, [index, flipped, speech.stop]);

  const advance = useCallback(
    (nextQueue: DeckCard[], nextIndex: number) => {
      setQueue(nextQueue);
      setIndex(nextIndex);
      setFlipped(false);
    },
    [],
  );

  const handleGotIt = useCallback(() => {
    if (!card) return;
    markGotIt(card.chapterSlug, card.id);
    setAnnounce(`Marked "${card.front}" as got it.`);
    const next = queue.filter((_, i) => i !== index);
    advance(next, Math.min(index, Math.max(next.length - 1, 0)));
  }, [card, index, queue, markGotIt, advance]);

  const handleReviewAgain = useCallback(() => {
    if (!card) return;
    markReviewAgain(card.chapterSlug, card.id);
    setAnnounce(`Moved "${card.front}" to the end of the deck.`);
    const rest = queue.filter((_, i) => i !== index);
    const next = [...rest, card];
    advance(next, rest.length ? Math.min(index, rest.length - 1) : 0);
  }, [card, index, queue, markReviewAgain, advance]);

  const handleFlip = useCallback(() => {
    if (!card) return;
    const next = !flipped;
    setFlipped(next);
    setAnnounce(next ? `Answer: ${card.back}` : `Question: ${card.front}`);
  }, [card, flipped]);

  // Swipe: right = got it, left = review again.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx > 0) handleGotIt();
    else handleReviewAgain();
  };

  const remaining = queue.length;
  const position = useMemo(
    () => (remaining ? `${Math.min(index + 1, remaining)} of ${remaining}` : ''),
    [index, remaining],
  );

  if (!cards.length) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 text-center">
        <p className="text-body">{emptyMessage}</p>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 text-center">
        <p className="font-display text-2xl font-semibold">
          You reviewed all {startedWith.current} cards 🎉
        </p>
        <p className="mt-2 text-body">{title}</p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              setQueue(shuffled ? shuffleArray(cards) : cards);
              setIndex(0);
              setFlipped(false);
            }}
            className="min-h-[48px] rounded-full bg-clu-gold px-5 font-semibold text-clu-purple"
          >
            Restart deck
          </button>
          {onDoneHref.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-[48px] items-center justify-center rounded-full border border-line px-5 font-semibold text-brand"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const faceText = flipped ? card.back : card.front;
  const progressPct = Math.round(
    ((startedWith.current - remaining) / Math.max(startedWith.current, 1)) * 100,
  );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2 text-sm text-body">
        <span aria-live="polite">{position}</span>
        <div className="flex gap-3">
          {showShuffle && (
            <button
              type="button"
              onClick={() => {
                const next = shuffled ? cards : shuffleArray(cards);
                setShuffled(!shuffled);
                setQueue(next);
                setIndex(0);
                setFlipped(false);
              }}
              className="min-h-[44px] font-medium underline underline-offset-4"
            >
              {shuffled ? 'Unshuffle' : 'Shuffle'}
            </button>
          )}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="min-h-[44px] font-medium underline underline-offset-4"
            >
              Reset deck
            </button>
          )}
        </div>
      </div>

      <div
        className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuenow={progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Cards reviewed"
      >
        <div
          className="h-full rounded-full bg-[color:var(--accent)] transition-[width]"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Card */}
      <div
        className="[perspective:1200px]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          onClick={handleFlip}
          aria-pressed={flipped}
          aria-describedby={faceDescriptionId}
          aria-label={
            flipped ? 'Show the question side' : 'Show the answer side'
          }
          className="w-full text-left"
        >
          {/*
            Both faces share one grid cell so the card grows to fit whichever
            face is taller — a long definition must not spill outside the card.
          */}
          <div
            className={`card-flip grid min-h-[16rem] w-full ${flipped ? 'is-flipped' : ''}`}
          >
            <div
              aria-hidden={flipped}
              className="card-face card-face-front col-start-1 row-start-1 flex flex-col justify-center rounded-2xl border border-line bg-surface p-6"
            >
              <p className="font-display text-2xl font-semibold leading-snug">
                {card.front}
              </p>
              <p className="mt-4 text-sm text-body">Tap to flip</p>
            </div>
            <div
              aria-hidden={!flipped}
              className="card-face card-face-back col-start-1 row-start-1 flex flex-col justify-center rounded-2xl border-2 border-[color:var(--accent)] bg-elevated p-6"
            >
              <p className="text-lg leading-relaxed">{card.back}</p>
              {card.section && (
                <p className="mt-3 text-xs uppercase tracking-wide text-body">
                  {card.section}
                </p>
              )}
            </div>
          </div>
        </button>
        <p id={faceDescriptionId} className="sr-only">
          {flipped ? `Answer: ${card.back}` : `Question: ${card.front}`}
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>

      {/* Controls */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleReviewAgain}
          aria-label={`Review again: ${card.front}`}
          className="min-h-[48px] rounded-full border border-line font-semibold text-body"
        >
          ↻ Review again
        </button>
        <button
          type="button"
          onClick={handleGotIt}
          aria-label={`Got it: ${card.front}`}
          className="min-h-[48px] rounded-full bg-clu-gold font-semibold text-clu-purple"
        >
          ✓ Got it
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {speech.supported && (
          <button
            type="button"
            onClick={() => speech.toggle(faceText)}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-line px-3 text-sm font-medium text-body"
            aria-label={speech.speaking ? 'Stop reading aloud' : 'Read this card aloud'}
          >
            {speech.speaking ? (
              <>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
                Stop
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                  <path
                    d="M4 9v6h4l5 4V5L8 9H4Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.5 8.5a5 5 0 0 1 0 7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                Listen
              </>
            )}
          </button>
        )}
        {flipped && (
          <AskAboutThis
            topic={card.chapterSlug}
            question={
              askPrefix
                ? askPrefix(card)
                : `Can you explain "${card.front}" in simpler terms? I'm reviewing ${card.chapterTitle}.`
            }
          />
        )}
      </div>
    </div>
  );
}
