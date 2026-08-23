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
                d="M21 12a8 8 0 1 1-3.2-6.4M21 12c0 1.6-.5 3-1.3 4.2L21 21l-4.8-1.3A8 8 0 0 1 12 20"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
