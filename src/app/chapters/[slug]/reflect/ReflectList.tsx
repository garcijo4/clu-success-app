'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Assessment, Chapter } from '@/lib/types';
import { useStore } from '@/lib/storage';
import AssessmentView from '@/components/AssessmentView';
import { accentStyle } from '@/lib/accent';
import { isAssessmentComplete } from '@/lib/assessment';

const KIND_LABEL: Record<Assessment['kind'], string> = {
  likert: 'Self check-in',
  reflection: 'Write',
  checklist: 'Checklist',
};

export default function ReflectList({ chapter }: { chapter: Chapter }) {
  const { chapter: getState, ready, touch } = useStore();
  const state = getState(chapter.slug);
  const [openId, setOpenId] = useState<string | null>(null);
  const activityHeading = useRef<HTMLHeadingElement>(null);
  const activityButtons = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    if (ready) touch(chapter.slug, 'reflect');
  }, [ready, chapter.slug, touch]);

  useEffect(() => {
    if (openId) activityHeading.current?.focus();
  }, [openId]);

  const open = chapter.assessments.find((a) => a.id === openId);

  return (
    <div
      data-accent
      style={accentStyle(chapter.themeColor, chapter.themeColorDark)}
    >
      {open ? (
        <>
          <button
            type="button"
            onClick={() => {
              const closingId = openId;
              setOpenId(null);
              window.requestAnimationFrame(() => {
                if (closingId) activityButtons.current.get(closingId)?.focus();
              });
            }}
            className="mb-3 inline-flex min-h-[44px] items-center text-sm text-body"
          >
            ← All activities
          </button>
          <h1
            ref={activityHeading}
            tabIndex={-1}
            className="mb-4 font-display text-xl font-semibold outline-none"
          >
            {open.title}
          </h1>
          <AssessmentView chapter={chapter} assessment={open} />
        </>
      ) : (
        <>
          <Link
            href={`/chapters/${chapter.slug}`}
            className="mb-3 inline-flex min-h-[44px] items-center text-sm text-body"
          >
            ← {chapter.title}
          </Link>
          <h1 className="mb-1 font-display text-xl font-semibold">Reflect &amp; assess</h1>
          <p className="mb-4 text-sm text-body">
            Private to this device. Nothing here is graded.
          </p>

          <ul className="space-y-3">
            {chapter.assessments.map((a) => {
              const saved = state.assessments[a.id];
              const done = ready && isAssessmentComplete(a, saved);
              const checkedCount = a.kind === 'checklist' ? saved?.checklist?.length ?? 0 : 0;
              return (
                <li key={a.id}>
                  <button
                    ref={(element) => {
                      if (element) activityButtons.current.set(a.id, element);
                      else activityButtons.current.delete(a.id);
                    }}
                    type="button"
                    onClick={() => setOpenId(a.id)}
                    className="flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface text-left"
                  >
                    <span className="h-1.5 w-full bg-[color:var(--accent)]" />
                    <span className="p-4">
                      <span className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full bg-[color:var(--accent)]/15 px-2 py-0.5 font-semibold">
                          {KIND_LABEL[a.kind]}
                        </span>
                        <span className="rounded-full border border-line px-2 py-0.5 text-body">
                          ~{a.estMinutes} min
                        </span>
                        {a.kind === 'checklist' && checkedCount > 0 && !done ? (
                          <span className="text-[color:var(--accent-text)]">
                            {checkedCount}/{a.items.length} checked
                          </span>
                        ) : done ? (
                          <span className="text-[color:var(--accent-text)]">✓ Done</span>
                        ) : null}
                      </span>
                      <span className="mt-2 block font-display text-lg font-semibold">
                        {a.title}
                      </span>
                      <span className="mt-1 block text-sm text-body">{a.intro}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <Link
            href="/about#my-work"
            className="mt-5 inline-flex min-h-[44px] items-center text-sm text-brand underline underline-offset-4 dark:text-clu-goldAlt"
          >
            Download all my reflections
          </Link>
        </>
      )}
    </div>
  );
}
