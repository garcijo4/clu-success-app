'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useStore } from '@/lib/storage';
import { accentStyle } from '@/lib/accent';
import Footer from '@/components/Footer';
import SupportNote from '@/components/SupportNote';
import { isAssessmentComplete } from '@/lib/assessment';

export interface HomeChapter {
  slug: string;
  number: number;
  title: string;
  studentSubtitle: string;
  themeColor: string;
  themeColorDark: string;
  keyIdeas: string[];
  /** Pre-lowercased summary text, for search only. */
  summaryText: string;
  sections: string[];
  flashcards: { id: string; front: string }[];
  assessments: { id: string; kind: 'likert' | 'reflection' | 'checklist'; items: { id: string }[] }[];
}

export default function HomePageClient({ chapters }: { chapters: HomeChapter[] }) {
  const { state, ready, chapter: getState } = useStore();
  const [query, setQuery] = useState('');

  const trickyCount = useMemo(() => {
    if (!ready) return 0;
    return chapters.reduce((sum, chapter) => {
      const saved = state.chapters[chapter.slug];
      if (!saved) return sum;
      return (
        sum +
        Object.entries(saved.reviewAgainCounts).filter(
          ([id, count]) => count >= 2 && !saved.flashcardsGotIt.includes(id),
        ).length
      );
    }, 0);
  }, [chapters, ready, state.chapters]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return null;
    return chapters
      .map((chapter) => {
        const cardHits = chapter.flashcards.filter((card) =>
          card.front.toLowerCase().includes(normalizedQuery),
        );
        const metaHit =
          chapter.title.toLowerCase().includes(normalizedQuery) ||
          chapter.studentSubtitle.toLowerCase().includes(normalizedQuery) ||
          chapter.sections.some((section) =>
            section.toLowerCase().includes(normalizedQuery),
          ) ||
          chapter.keyIdeas.some((idea) => idea.toLowerCase().includes(normalizedQuery)) ||
          chapter.summaryText.includes(normalizedQuery);
        return { chapter, cardHits, metaHit };
      })
      .filter((result) => result.metaHit || result.cardHits.length);
  }, [chapters, query]);

  const last = state.lastVisited;
  const lastChapter = last
    ? chapters.find((chapter) => chapter.slug === last.chapterSlug)
    : undefined;
  const lastSaved = lastChapter ? state.chapters[lastChapter.slug] : undefined;
  const continueDetail =
    lastChapter && lastSaved && last
      ? last.activity === 'flashcards'
        ? `${Math.max(0, lastChapter.flashcards.length - lastSaved.flashcardsGotIt.length)} cards left`
        : `${lastChapter.assessments.filter((assessment) =>
            isAssessmentComplete(assessment, lastSaved.assessments[assessment.id]),
          ).length} of ${lastChapter.assessments.length} activities complete`
      : '';

  return (
    <div>
      <section className="-mx-4 mb-5 bg-brand px-4 py-6 text-white">
        <h1 className="font-display text-2xl font-semibold">
          What do you want to work on today?
        </h1>
        <p className="mt-1 text-sm text-white">
          Pick any chapter — there&rsquo;s no required order.
        </p>
      </section>

      <Link
        href="/ask"
        className="mb-4 flex min-h-[76px] items-center gap-3 rounded-2xl border-2 border-clu-gold bg-clu-gold/10 p-4"
      >
        <span
          aria-hidden="true"
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-clu-gold text-xl text-clu-purple"
        >
          ?
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">Ask the College Success chatbot</span>
          <span className="block text-sm text-body">
            Ask a question without choosing a chapter first
          </span>
        </span>
        <span aria-hidden="true" className="text-xl text-clu-gold">
          →
        </span>
      </Link>

      {ready && lastChapter && last ? (
        <Link
          href={`/chapters/${lastChapter.slug}/${last.activity === 'reflect' ? 'reflect' : 'flashcards'}`}
          className="mb-4 flex items-center gap-3 rounded-2xl border border-line bg-surface p-4"
        >
          <span className="text-2xl" aria-hidden="true">↩︎</span>
          <span>
            <span className="block text-sm text-body">Pick up where you left off</span>
            <span className="block font-semibold">
              Chapter {lastChapter.number} ·{' '}
              {last.activity === 'reflect' ? 'Reflections' : 'Flashcards'}
            </span>
            {continueDetail ? (
              <span className="block text-sm text-body">{continueDetail}</span>
            ) : null}
          </span>
        </Link>
      ) : null}

      {ready && trickyCount > 0 ? (
        <Link
          href="/tricky"
          className="mb-4 flex items-center gap-3 rounded-2xl border border-clu-gold bg-clu-gold/10 p-4"
        >
          <span className="text-2xl" aria-hidden="true">★</span>
          <span>
            <span className="block font-semibold">Tricky cards ({trickyCount})</span>
            <span className="block text-sm text-body">Worth one more look</span>
          </span>
        </Link>
      ) : null}

      <div className="mb-2">
        <label htmlFor="search" className="font-display text-lg font-semibold">
          Find a topic
        </label>
        <p className="text-sm text-body">Try “procrastination,” “budget,” or “APR.”</p>
      </div>
      <input
        id="search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search topics or flashcards"
        className="mb-5 w-full rounded-full border border-line bg-surface px-5 py-3 text-ink placeholder:text-body/60"
      />

      {results ? (
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold">
            {results.length
              ? `${results.length} chapter${results.length > 1 ? 's' : ''}`
              : 'No matches'}
          </h2>
          <ul className="space-y-3">
            {results.map(({ chapter, cardHits }) => (
              <li key={chapter.slug}>
                <Link
                  href={
                    cardHits.length
                      ? `/chapters/${chapter.slug}/flashcards?find=${encodeURIComponent(query.trim())}`
                      : `/chapters/${chapter.slug}`
                  }
                  data-accent
                  style={accentStyle(chapter.themeColor, chapter.themeColorDark)}
                  className="chapter-card block rounded-2xl border border-line bg-surface p-4"
                >
                  <span className="block text-sm text-body">Chapter {chapter.number}</span>
                  <span className="block font-semibold">{chapter.title}</span>
                  {cardHits.length > 0 ? (
                    <span className="mt-1 block text-sm text-[color:var(--accent-text)]">
                      {cardHits.length} matching card{cardHits.length > 1 ? 's' : ''} —
                      “{cardHits[0].front}” · Start there →
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {chapters.map((chapter) => {
            const saved = ready ? getState(chapter.slug) : null;
            const cardPercent = saved
              ? Math.round((saved.flashcardsGotIt.length / chapter.flashcards.length) * 100)
              : 0;
            const doneActivities = saved
              ? chapter.assessments.filter(
                  (assessment) =>
                    isAssessmentComplete(
                      assessment,
                      saved.assessments[assessment.id],
                    ),
                ).length
              : 0;
            return (
              <li key={chapter.slug}>
                <Link
                  href={`/chapters/${chapter.slug}`}
                  data-accent
                  style={accentStyle(chapter.themeColor, chapter.themeColorDark)}
                  className="chapter-card flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface"
                >
                  <span className="h-1.5 w-full bg-[color:var(--accent)]" />
                  <span className="flex flex-1 flex-col p-3">
                    <span className="text-xs font-semibold text-[color:var(--accent-text)]">
                      CHAPTER {chapter.number}
                    </span>
                    <span className="mt-1 font-display text-base font-semibold leading-snug">
                      {chapter.title}
                    </span>
                    <span className="mt-1 flex-1 text-xs text-body">
                      {chapter.studentSubtitle}
                    </span>
                    {ready && (cardPercent > 0 || doneActivities > 0) ? (
                      <span className="mt-3 block">
                        <span className="mb-1 block h-1 overflow-hidden rounded-full bg-line">
                          <span
                            className="block h-full rounded-full bg-[color:var(--accent)]"
                            style={{ width: `${cardPercent}%` }}
                          />
                        </span>
                        <span className="block text-[11px] text-body">
                          {cardPercent}% cards · {doneActivities}/{chapter.assessments.length} activities
                        </span>
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-6">
        <SupportNote />
      </div>

      <Footer />
    </div>
  );
}
