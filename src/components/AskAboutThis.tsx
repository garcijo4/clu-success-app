'use client';

import Link from 'next/link';

/**
 * Sends the student to the chatbot with the question already composed.
 * The bot is a third-party iframe, so we cannot type into it directly —
 * /ask shows the question and copies it for pasting (design plan §4.6).
 */
export default function AskAboutThis({
  question,
  topic,
  className = '',
}: {
  question: string;
  topic: string;
  className?: string;
}) {
  const q = question.slice(0, 300);
  const href = `/ask?q=${encodeURIComponent(q)}&topic=${encodeURIComponent(topic)}`;

  return (
    <Link
      href={href}
      className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-line px-3 text-sm font-medium text-body hover:border-brand hover:text-brand ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path
          d="M21 12a8 8 0 1 1-3.2-6.4M21 12c0 1.6-.5 3-1.3 4.2L21 21l-4.8-1.3A8 8 0 0 1 12 20"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Ask about this
    </Link>
  );
}
