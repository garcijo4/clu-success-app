'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function AppBar() {
  return (
    <header className="sticky top-0 z-30 border-b-4 border-clu-gold bg-brand text-white">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <Link href="/" className="min-w-0 leading-tight">
          <span className="block truncate font-display text-lg font-semibold">
            College Success
          </span>
          <span className="block text-xs text-white">CLU First Year Seminar</span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/ask"
            aria-label="Ask the study chatbot"
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
              <path
                d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.6-4.6A8.5 8.5 0 1 1 20.5 11.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
