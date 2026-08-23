# College Success Companion

Interactive review app for **First Year Seminar students at California Lutheran University**, based on the OpenStax *College Success* textbook. Mobile-first, no accounts, no backend — every student's progress lives in their own browser.

Built to the spec in `college-success-app-design-plan.md` (in the parent folder).

---

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Requires Node 20.9+ (the minimum supported by Next.js 16).

```bash
npm run build && npm start   # production build
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, **Add New → Project** and import that repo.
3. Framework preset: **Next.js**. No environment variables are needed. Click Deploy.

Or from this folder: `npx vercel` (then `npx vercel --prod`).

> This project is currently inside a Google Drive folder. Drive syncing `node_modules/`
> can be slow — `.gitignore` already excludes it, and it's worth moving the project to a
> normal local folder (or straight to GitHub) before doing heavy development.

---

## Connecting the chatbot

Open `src/components/ChatEmbed.tsx` and paste your bot platform's embed snippet into the
`EMBED_HTML` template literal near the top:

```ts
const EMBED_HTML = `<script src="https://your-bot-platform.example/widget.js" ...></script>`;
```

That's the only change required. Notes:

- `<script>` tags inside the snippet are re-created and injected so the widget actually
  boots — React does not execute scripts from `dangerouslySetInnerHTML`.
- While `EMBED_HTML` is empty, the page shows a friendly "Chatbot coming soon" placeholder.
- **Optional pre-fill:** the app sends students to `/ask?q=<question>&topic=<chapter-slug>`
  from flashcards and reflections. The question is shown in a card above the chat and
  auto-copied to the clipboard, because a page cannot type into a third-party iframe. If
  your platform exposes a prefill API (URL param, data attribute, or `postMessage`), wire
  it into the `applyPrefill()` function in the same file and return `true`.

The bot's system prompt is in `College_Success_Chatbot_Prompt.docx` in the parent folder.

---

## What's in here

| Path | What it is |
|---|---|
| `src/content/ch01.ts` … `ch12.ts` | All chapter content — 192 flashcards and 36 activities, sourced from the book |
| `src/content/index.ts` | Assembles the chapters; `getChapter(slug)` |
| `src/lib/types.ts` | The `Chapter` / `Assessment` / `AppState` shapes |
| `src/lib/storage.tsx` | `localStorage` persistence (key `clu-fys-companion:v1`) + React context |
| `src/lib/speech.ts` | Text-to-speech "Listen" button (Web Speech API) |
| `src/lib/exportReflections.ts` | Builds the downloadable reflections Markdown file |
| `src/components/FlashcardDeck.tsx` | The flip/swipe card engine, shared by all three decks |
| `src/components/AssessmentView.tsx` | Likert check-ins, written reflections, checklists |
| `src/components/ChatEmbed.tsx` | **Paste the chatbot embed here** |
| `src/app/` | Routes (see below) |

### Routes

- `/` — home: Quick Review button, continue card, tricky cards, search, 12 chapter cards
- `/quick` — 10-card mixed deck, ~5 minutes
- `/tricky` — cross-chapter deck of cards the student keeps missing
- `/chapters/[slug]` — chapter hub
- `/chapters/[slug]/flashcards` — that chapter's deck
- `/chapters/[slug]/reflect` — that chapter's 3 activities
- `/ask` — chatbot (accepts `?q=` and `?topic=`)
- `/about` — privacy, download/copy reflections, reset, credits

## Editing content

Chapter content is plain TypeScript — edit `src/content/chNN.ts` directly. To add a
flashcard, append to the `flashcards` array with a unique `id` within that chapter.

Likert assessments score the sum of all answers, so **`resultBands` must cover the full
range with no gaps or overlaps**: for 7 items the range is 7–35 (e.g. 7–16, 17–26, 27–35).
Keep band language encouraging — a low score is "an area to grow", never a failure.

## Design notes

- **Branding:** official Cal Lutheran palette. Heritage purple `#3B2360` and gold `#FFC222`
  dominate; the nine secondary colors are per-chapter accents. Gold never carries white
  text (it fails contrast) — always purple/ink on gold.
- **Dark mode:** system / light / dark, toggled in the app bar. In dark mode the UI purple
  swaps to the alternate `#6A4C92`, since the primary purple disappears against a dark
  background; gold is unchanged. Chapter accents map to lighter siblings via
  `themeColorDark`.
- **Accessibility:** WCAG 2.1 AA targeted in both themes — 44px+ touch targets, visible
  focus rings, `aria-live` announcements on card actions, and `prefers-reduced-motion`
  swapping the card flip for a crossfade. The "Listen" button is a convenience, not a
  replacement for screen-reader support.
- **Privacy:** no analytics, no cookies, and no runtime network calls except the chatbot
  embed. Fonts are downloaded at build time and served with the app.

## Attribution

Content adapted from *College Success* by Amy Baldwin et al., OpenStax (Rice University),
licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Access for free
at [openstax.org](https://openstax.org/books/college-success). The attribution appears in
the app footer and on `/about` and must stay there.
