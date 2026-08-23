'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/', label: 'Explore' },
  { href: '/ask', label: 'Ask' },
  { href: '/about', label: 'About' },
];

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
                className={`flex min-h-[52px] items-center justify-center text-sm font-semibold ${
                  active
                    ? 'text-clu-gold underline decoration-clu-gold decoration-2 underline-offset-8'
                    : 'text-white'
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
