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
      className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-line px-3 text-sm font-medium text-body hover:border-brand hover:text-brand dark:hover:border-clu-goldAlt dark:hover:text-clu-goldAlt ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path
          d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.6-4.6A8.5 8.5 0 1 1 20.5 11.5Z"
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
