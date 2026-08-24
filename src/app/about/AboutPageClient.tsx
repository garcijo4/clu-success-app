'use client';

import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/lib/storage';
import {
  buildReflectionsMarkdown,
  copyText,
  hasAnyReflections,
} from '@/lib/exportReflections';
import type { ReflectionExportChapter } from '@/lib/reflectionsMarkdown';
import Footer from '@/components/Footer';
import SupportNote from '@/components/SupportNote';

export default function AboutPageClient({
  chapters,
}: {
  chapters: ReflectionExportChapter[];
}) {
  const { state, ready, resetAll } = useStore();
  const [copied, setCopied] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const anything = ready && hasAnyReflections(chapters, state);
  const exportText = useMemo(
    () => (anything ? buildReflectionsMarkdown(chapters, state) : ''),
    [anything, chapters, state],
  );
  const [downloadUrl, setDownloadUrl] = useState('');

  // Keep the download attached to the student's actual click. In particular,
  // iOS Safari is more reliable with a real link than a synthetic anchor.click().
  useEffect(() => {
    if (!exportText) {
      setDownloadUrl('');
      return;
    }
    const url = URL.createObjectURL(
      new Blob([exportText], { type: 'text/markdown;charset=utf-8' }),
    );
    setDownloadUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [exportText]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">About this app</h1>

      <p className="mt-3 leading-relaxed text-body">
        This is a companion to the OpenStax <em>College Success</em> textbook, built for
        First Year Seminar students at California Lutheran University. Pick any chapter in
        any order, review with flashcards, and use the reflection activities to think
        through how the ideas apply to you.
      </p>

      <section className="mt-6 rounded-2xl border border-line bg-surface p-4">
        <h2 className="font-display text-lg font-semibold">Your privacy</h2>
        <p className="mt-2 leading-relaxed text-body">
          Your card progress, check-in answers, and reflections are saved{' '}
          <strong>only in this browser on this device</strong>. They are never uploaded,
          your instructor cannot see them, and nothing here is graded. Clearing your browser
          data will erase them, so use the download button below if you need to keep a copy.
        </p>
        <p className="mt-3 leading-relaxed text-body">
          Questions you enter in the chatbot are anonymous, but are recorded, so leave out
          private or sensitive information.
        </p>
      </section>

      <section id="my-work" className="mt-6 scroll-mt-20">
        <h2 className="font-display text-lg font-semibold">My work</h2>
        {!ready ? (
          <div className="mt-2 h-24 animate-pulse rounded-2xl bg-surface" />
        ) : anything ? (
          <div className="mt-2 space-y-2 rounded-2xl border border-line bg-surface p-4">
            <a
              href={downloadUrl || undefined}
              download="my-college-success-reflections.md"
              aria-disabled={!downloadUrl}
              onClick={(event) => {
                if (!downloadUrl) {
                  event.preventDefault();
                  return;
                }
                setDownloadStarted(true);
              }}
              className={`flex min-h-[48px] w-full items-center justify-center rounded-full bg-clu-gold px-5 font-semibold text-clu-purple ${
                downloadUrl ? '' : 'pointer-events-none opacity-40'
              }`}
            >
              Download all my reflections
            </a>
            <button
              type="button"
              onClick={async () => {
                const ok = await copyText(buildReflectionsMarkdown(chapters, state));
                setCopied(ok);
                setTimeout(() => setCopied(false), 3000);
              }}
              className="min-h-[48px] w-full rounded-full border border-line px-5 font-semibold text-brand dark:text-clu-goldAlt"
            >
              {copied ? 'Copied ✓' : 'Copy all to clipboard'}
            </button>
            <p className="text-sm text-body">
              Handy if your instructor asks you to turn in a reflection — download the file
              or paste it into Canvas.
            </p>
            {downloadStarted ? (
              <p role="status" className="text-sm text-body">
                Download started. Look for my-college-success-reflections.md in your
                downloads.
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mt-2 text-body">
            You haven&rsquo;t written any reflections yet — they&rsquo;ll show up here once
            you do.
          </p>
        )}
      </section>

      <section className="mt-6">
        <h2 className="font-display text-lg font-semibold">Questions or problems?</h2>
        <p className="mt-2 leading-relaxed text-body">
          If anything in the app is broken, confusing, or wrong, please include what you
          were doing and what phone or browser you were using — it makes the fix much faster.
        </p>
        <div className="mt-3">
          <SupportNote />
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-lg font-semibold">Reset</h2>
        {confirmReset ? (
          <div className="mt-2 rounded-2xl border-2 border-chapter-red p-4">
            <p className="font-medium">
              Erase all your progress and reflections on this device? This can&rsquo;t be
              undone.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  resetAll();
                  setConfirmReset(false);
                }}
                className="min-h-[48px] flex-1 rounded-full border-2 border-chapter-red bg-surface px-4 font-semibold text-ink"
              >
                Yes, erase everything
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-[48px] flex-1 rounded-full border border-line px-4 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="mt-2 min-h-[48px] rounded-full border border-line px-5 font-semibold text-body"
          >
            Reset all my data
          </button>
        )}
      </section>

      <section className="mt-6">
        <h2 className="font-display text-lg font-semibold">Credits</h2>
        <p className="mt-2 leading-relaxed text-body">
          Content adapted from <em>College Success</em> by Amy Baldwin, James Onestak,
          Nicole Yates, and contributors, published by OpenStax (Rice University) and
          licensed under Creative Commons Attribution 4.0 International (CC BY 4.0).
          Access the full book for free at{' '}
          <a
            href="https://openstax.org/books/college-success"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            openstax.org
          </a>
          .
        </p>
      </section>

      <Footer />
    </div>
  );
}
