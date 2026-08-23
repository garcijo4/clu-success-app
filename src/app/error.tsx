'use client';

import Link from 'next/link';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-2xl border-2 border-clu-gold bg-surface p-6 text-center">
      <h1 className="font-display text-2xl font-semibold">This page hit a snag</h1>
      <p className="mt-2 text-body">
        Your saved work is still on this device. Try the page again or head back home.
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={reset}
          className="min-h-[48px] rounded-full bg-clu-gold px-5 font-semibold text-clu-purple"
        >
          Try again
        </button>
        <Link
          href="/"
          className="flex min-h-[48px] items-center justify-center rounded-full border border-line px-5 font-semibold text-brand"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
