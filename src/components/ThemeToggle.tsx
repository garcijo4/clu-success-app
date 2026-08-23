'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/storage';
import type { ThemeSetting } from '@/lib/types';

const ORDER: ThemeSetting[] = ['system', 'light', 'dark'];
const LABEL: Record<ThemeSetting, string> = {
  system: 'Theme: match my phone',
  light: 'Theme: light',
  dark: 'Theme: dark',
};

function apply(setting: ThemeSetting) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = setting === 'dark' || (setting === 'system' && prefersDark);
  document.documentElement.classList.toggle('dark', dark);
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    meta.content = dark ? '#14111C' : '#3B2360';
  });
}

export default function ThemeToggle() {
  const { state, ready, setTheme } = useStore();
  const setting = state.theme ?? 'system';

  useEffect(() => {
    if (!ready) return;
    apply(setting);
    if (setting !== 'system') return;
    // Follow the OS while set to "system".
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => apply('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [setting, ready]);

  const next = ORDER[(ORDER.indexOf(setting) + 1) % ORDER.length];

  return (
    <button
      type="button"
      disabled={!ready}
      onClick={() => setTheme(next)}
      aria-label={`${LABEL[setting]}. Switch to ${LABEL[next].replace('Theme: ', '')}`}
      title={LABEL[setting]}
      className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-60"
    >
      {setting === 'dark' ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M21 13a8.5 8.5 0 0 1-10-10 8.5 8.5 0 1 0 10 10Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      ) : setting === 'light' ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <rect
            x="3"
            y="4.5"
            width="18"
            height="13"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="M8 21h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
