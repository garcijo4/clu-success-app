'use client';

import { useEffect, useRef } from 'react';

/**
 * ─────────────────────────────────────────────────────────────────────
 *  PASTE THE CHATBOT EMBED SNIPPET FROM YOUR BOT PLATFORM BELOW.
 *  Everything between the backticks is injected into the page as-is.
 *  Leave it empty and a friendly placeholder shows instead.
 * ─────────────────────────────────────────────────────────────────────
 */
const EMBED_HTML = ``;

/**
 * OPTIONAL: if your chat platform supports opening with a pre-filled message
 * (a URL parameter, a data attribute, or a postMessage API), wire it here.
 * Return true if you handled the prefill; the "Your question" card above the
 * embed stays visible either way so the student can always copy and paste.
 */
function applyPrefill(_question: string): boolean {
  // Example for a widget exposing a global:
  //   window.MyChatWidget?.setInput(_question); return true;
  return false;
}

export default function ChatEmbed({ question }: { question?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !EMBED_HTML.trim()) return;

    host.innerHTML = EMBED_HTML;

    // React does not execute <script> tags inserted via innerHTML.
    // Re-create each one so the widget actually boots.
    const scripts = Array.from(host.querySelectorAll('script'));
    const injected: HTMLScriptElement[] = [];
    for (const old of scripts) {
      const script = document.createElement('script');
      for (const attr of Array.from(old.attributes)) {
        script.setAttribute(attr.name, attr.value);
      }
      script.text = old.textContent ?? '';
      old.replaceWith(script);
      injected.push(script);
    }

    return () => {
      injected.forEach((s) => s.remove());
      host.innerHTML = '';
    };
  }, []);

  useEffect(() => {
    if (question) applyPrefill(question);
  }, [question]);

  if (!EMBED_HTML.trim()) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-surface p-8 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-clu-gold text-2xl">
          💬
        </div>
        <h2 className="font-display text-xl font-semibold">Chatbot coming soon</h2>
        <p className="mt-2 max-w-sm text-body">
          Your instructor will connect the study chatbot here. Once it&rsquo;s live you can
          ask it anything about the College Success book or about college life.
        </p>
        <p className="mt-4 text-xs text-body/70">
          Developer note: paste the embed snippet into <code>EMBED_HTML</code> in{' '}
          <code>src/components/ChatEmbed.tsx</code>.
        </p>
      </div>
    );
  }

  return <div ref={hostRef} className="min-h-[70vh] w-full" />;
}
