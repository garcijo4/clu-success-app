'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/', label: 'Explore', icon: 'explore' },
  { href: '/ask', label: 'Ask', icon: 'ask' },
  { href: '/about', label: 'About', icon: 'about' },
];

function TabIcon({ name }: { name: string }) {
  if (name === 'explore') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M4 5.5h6.2A3.8 3.8 0 0 1 14 9.3v9.2H7.8A3.8 3.8 0 0 0 4 22.3V5.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M20 5.5h-2.2A3.8 3.8 0 0 0 14 9.3v9.2h2.2a3.8 3.8 0 0 1 3.8 3.8V5.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === 'ask') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.6-4.6A8.5 8.5 0 1 1 20.5 11.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M9.8 9.2a2.4 2.4 0 1 1 3.6 2.1c-.9.5-1.4 1-1.4 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M12 16.8h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 10.5v6M12 7.3h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-clu-purpleAlt/40 bg-brand pb-[env(safe-area-inset-bottom)] text-white md:hidden"
    >
      <ul className="mx-auto flex max-w-3xl">
        {TABS.map((tab) => {
          const active =
            tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-[60px] flex-col items-center justify-center gap-0.5 text-xs font-semibold ${
                  active
                    ? 'text-clu-gold underline decoration-clu-gold decoration-2 underline-offset-8'
                    : 'text-white'
                }`}
              >
                <TabIcon name={tab.icon} />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
