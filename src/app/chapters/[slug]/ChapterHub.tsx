'use client';

import Link from 'next/link';
import type { Chapter } from '@/lib/types';
import { useStore } from '@/lib/storage';
import Footer from '@/components/Footer';
import ChapterSummary from '@/components/ChapterSummary';
import { accentStyle } from '@/lib/accent';
import { isAssessmentComplete } from '@/lib/assessment';

export default function ChapterHub({ chapter }: { chapter: Chapter }) {
  const { chapter: getState, ready } = useStore();
  const state = getState(chapter.slug);

  const gotIt = ready ? state.flashcardsGotIt.length : 0;
  const activitiesDone = ready
    ? chapter.assessments.filter((assessment) =>
        isAssessmentComplete(assessment, state.assessments[assessment.id]),
      ).length
    : 0;
  const cardMinutes = Math.max(1, Math.round(chapter.flashcards.length / 4));

  return (
    <div
      data-accent
      style={accentStyle(chapter.themeColor, chapter.themeColorDark)}
    >
      <Link href="/" className="mb-3 inline-flex min-h-[44px] items-center text-sm text-body">
        ← All chapters
      </Link>

      <header className="-mx-4 mb-5 border-t-[6px] border-[color:var(--accent)] bg-surface px-4 py-6 text-ink">
        <p className="text-sm font-semibold uppercase tracking-wide">
          Chapter {chapter.number}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold">{chapter.title}</h1>
        <p className="mt-1">{chapter.studentSubtitle}</p>
        <p className="mt-3 leading-relaxed">{chapter.blurb}</p>
      </header>

      <section className="mb-6 rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-3 font-display text-lg font-semibold">Key ideas</h2>
        <ul className="space-y-2">
          {chapter.keyIdeas.map((idea, i) => (
            <li key={i} className="flex gap-2.5 text-body">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--accent)]"
              />
              <span>{idea}</span>
            </li>
          ))}
        </ul>
      </section>

      <ChapterSummary sections={chapter.summary} chapterTitle={chapter.title} />

      <div className="mb-6 space-y-3">
        <Link
          href={`/chapters/${chapter.slug}/flashcards`}
          className="flex min-h-[64px] items-center justify-between gap-3 rounded-2xl bg-clu-gold px-5 py-3 font-semibold text-clu-purple"
        >
          <span>
            <span className="block text-lg">Flashcards</span>
            <span className="block text-sm font-medium text-clu-purple/80">
              {ready ? `${gotIt}/${chapter.flashcards.length} reviewed` : `${chapter.flashcards.length} cards`}{' '}
              · ~{cardMinutes} min
            </span>
          </span>
          <span aria-hidden="true">→</span>
        </Link>

        <Link
          href={`/chapters/${chapter.slug}/reflect`}
          className="flex min-h-[64px] items-center justify-between gap-3 rounded-2xl border-2 border-[color:var(--accent)] px-5 py-3 font-semibold"
        >
          <span>
            <span className="block text-lg">Reflect &amp; assess</span>
            <span className="block text-sm font-medium text-body">
              {ready
                ? `${activitiesDone} of ${chapter.assessments.length} done`
                : `${chapter.assessments.length} activities`}
            </span>
          </span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="space-y-2 text-sm">
        <a
          href={chapter.openstaxUrl}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-[44px] items-center text-brand underline underline-offset-4 dark:text-clu-goldAlt"
        >
          Read this chapter free at OpenStax ↗
        </a>
        <Link
          href={`/ask?topic=${chapter.slug}`}
          className="flex min-h-[44px] items-center text-brand underline underline-offset-4 dark:text-clu-goldAlt"
        >
          Ask the chatbot about this chapter
        </Link>
      </div>

      <section className="mt-6">
        <h2 className="mb-2 font-display text-lg font-semibold">In this chapter</h2>
        <ul className="space-y-1 text-sm text-body">
          {chapter.sections.map((s) => (
            <li key={s}>· {s}</li>
          ))}
        </ul>
      </section>

      <Footer />
    </div>
  );
}
