'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getChapter } from '@/content';
import ChatEmbed from '@/components/ChatEmbed';
import { copyText } from '@/lib/exportReflections';
import Footer from '@/components/Footer';

const EXAMPLES = [
  'How do I stop procrastinating?',
  "What's a growth mindset?",
  'How should I take notes in a lecture class?',
];

function AskInner() {
  const params = useSearchParams();
  const question = params.get('q') ?? '';
  const topic = params.get('topic') ?? '';
  const chapter = topic ? getChapter(topic) : undefined;

  const [text, setText] = useState(question);
  const [copied, setCopied] = useState(false);

  useEffect(() => setText(question), [question]);

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
      <h1 className="font-display text-xl font-semibold">Ask</h1>
      <p className="mb-4 text-sm text-body">
        Ask anything about the College Success book — or about college life at Cal
        Lutheran.
      </p>

      {question && (
        <section className="mb-4 rounded-2xl border-2 border-clu-gold bg-clu-gold/10 p-4">
          <h2 className="text-sm font-semibold">
            Your question{chapter ? ` about ${chapter.title}` : ''}
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
        </section>
      )}

      <ChatEmbed question={question || undefined} />

      <section className="mt-5">
        <h2 className="mb-2 text-sm font-semibold text-body">Not sure what to ask?</h2>
        <ul className="flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <li key={example}>
              <span className="inline-block rounded-full border border-line bg-surface px-3 py-2 text-sm text-body">
                {example}
              </span>
            </li>
          ))}
        </ul>
      </section>

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
