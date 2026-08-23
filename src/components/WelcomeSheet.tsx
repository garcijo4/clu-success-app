'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/storage';

export default function WelcomeSheet() {
  const { state, ready, setWelcomed } = useStore();
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ready || state.welcomed) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setWelcomed();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(
        dialog.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => !element.hasAttribute('disabled'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus();
    };
  }, [ready, setWelcomed, state.welcomed]);

  if (!ready || state.welcomed) return null;

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center"
    >
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-5 shadow-xl">
        <h2 id="welcome-title" className="font-display text-xl font-semibold">
          Welcome 👋
        </h2>
        <p className="mt-2 text-body">
          Pick any chapter — there&rsquo;s no required order. Everything you do here stays
          on your phone: it&rsquo;s not graded, and nobody else can see it.
        </p>
        <button
          ref={closeButton}
          type="button"
          onClick={setWelcomed}
          className="mt-4 min-h-[48px] w-full rounded-full bg-clu-gold px-5 font-semibold text-clu-purple"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
