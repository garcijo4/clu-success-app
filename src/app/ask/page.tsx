'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getChapterTitle } from '@/content/catalog';
import ChatEmbed from '@/components/ChatEmbed';
import { copyText } from '@/lib/exportReflections';
import Footer from '@/components/Footer';

function AskInner() {
  const params = useSearchParams();
  const question = (params.get('q') ?? '').slice(0, 300);
  const topic = params.get('topic') ?? '';
  const chapterTitle = topic ? getChapterTitle(topic) : undefined;
  const startingQuestion =
    question ||
    (chapterTitle
      ? `What are the most important ideas in ${chapterTitle}, and how can I use one this week?`
      : '');

  const [text, setText] = useState(startingQuestion);
  const [copied, setCopied] = useState(false);

  useEffect(() => setText(startingQuestion), [startingQuestion]);

  // Auto-copy on arrival so the student can paste straight into the chat.
  useEffect(() => {
    if (!question) return;
    copyText(question).then((ok) => {
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 4000);
      }
    });
  }, [question]);

  return (
    <div>
      {text && (
        <section className="mb-4 rounded-2xl border-2 border-clu-gold bg-clu-gold/10 p-4">
          <h2 className="text-sm font-semibold">
            Your question{chapterTitle ? ` about ${chapterTitle}` : ''}
          </h2>
          <label htmlFor="composed" className="sr-only">
            Your question — edit it if you like
          </label>
          <textarea
            id="composed"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-line bg-surface p-3 text-sm leading-relaxed text-ink"
          />
          <button
            type="button"
            onClick={async () => {
              const ok = await copyText(text);
              setCopied(ok);
              setTimeout(() => setCopied(false), 3000);
            }}
            className="mt-2 min-h-[44px] rounded-full bg-clu-gold px-4 text-sm font-semibold text-clu-purple"
          >
            {copied ? 'Copied — paste it into the chat below ✓' : 'Copy question'}
          </button>
          <button
            type="button"
            onClick={() => {
              setText('');
              setCopied(false);
            }}
            className="ml-3 min-h-[44px] text-sm font-medium text-brand underline underline-offset-4 dark:text-clu-goldAlt"
          >
            Choose another
          </button>
        </section>
      )}

      <ChatEmbed />

      <Footer />
    </div>
  );
}

export default function AskPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-surface" />}>
      <AskInner />
    </Suspense>
  );
}
