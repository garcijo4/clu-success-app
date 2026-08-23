import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/storage';
import AppBar from '@/components/AppBar';
import TabBar from '@/components/TabBar';
import WelcomeSheet from '@/components/WelcomeSheet';
import StorageNotice from '@/components/StorageNotice';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['SOFT', 'WONK'],
});

export const metadata: Metadata = {
  title: 'College Success Companion',
  description:
    'Interactive review for First Year Seminar at California Lutheran University, based on the OpenStax College Success textbook.',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'CLU Success', statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3B2360' },
    { media: '(prefers-color-scheme: dark)', color: '#14111C' },
  ],
};

// Applies the saved theme before first paint so there is no white flash.
const themeScript = `
(function () {
  try {
    var raw = localStorage.getItem('clu-fys-companion:v1');
    var setting = raw ? (JSON.parse(raw).theme || 'system') : 'system';
    var dark = setting === 'dark' ||
      (setting === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
      meta.setAttribute('content', dark ? '#14111C' : '#3B2360');
    });
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh bg-bg text-ink antialiased">
        <StoreProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-clu-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-clu-purple"
          >
            Skip to content
          </a>
          <AppBar />
          <main
            id="main"
            className="mx-auto w-full max-w-3xl px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-4"
          >
            <StorageNotice />
            {children}
          </main>
          <TabBar />
          <WelcomeSheet />
        </StoreProvider>
      </body>
    </html>
  );
}
