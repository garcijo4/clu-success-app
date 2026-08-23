'use client';

import { useRef, useState } from 'react';
import type { SummarySection } from '@/lib/types';

/**
 * The plain-language chapter summary.
 * Native <details> so it stays keyboard- and screen-reader-friendly for free;
 * collapsed by default (except the first) so a long chapter is still scannable
 * on a phone.
 */
export default function ChapterSummary({
  sections,
  chapterTitle,
}: {
  sections: SummarySection[];
  chapterTitle: string;
}) {
  const [allOpen, setAllOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  if (!sections?.length) return null;

  const toggleAll = () => {
    const next = !allOpen;
    setAllOpen(next);
    wrapRef.current
      ?.querySelectorAll('details')
      .forEach((d) => {
        d.open = next;
      });
  };

  return (
    <section className="mb-6">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg font-semibold">The short version</h2>
        <button
          type="button"
          onClick={toggleAll}
          className="min-h-[44px] text-sm font-medium text-brand underline underline-offset-4"
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>
      <p className="mb-3 text-sm text-body">
        Everything {chapterTitle} covers, in plain language. Tap a topic to read it —
        head to the book when you want the full detail.
      </p>

      <div ref={wrapRef} className="space-y-2">
        {sections.map((section, i) => (
          <details
            key={section.heading}
            open={i === 0}
            className="group overflow-hidden rounded-2xl border border-line bg-surface [&>summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 p-4 font-semibold">
              <span>{section.heading}</span>
              <span
                aria-hidden="true"
                className="flex-none text-body transition-transform group-open:rotate-180"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path
                    d="m6 9 6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4">
              <p className="leading-relaxed text-body">{section.body}</p>
              {section.example && (
                <div className="mt-3 rounded-xl border-l-4 border-[color:var(--accent)] bg-[color:var(--accent)]/10 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--accent-text)]">
                    Picture this
                  </p>
                  <p className="mt-1 leading-relaxed">{section.example}</p>
                </div>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
