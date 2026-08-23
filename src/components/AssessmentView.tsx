'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Assessment, Chapter } from '@/lib/types';
import { useStore } from '@/lib/storage';
import { findResultBand } from '@/lib/assessment';
import { copyText } from '@/lib/exportReflections';
import AskAboutThis from './AskAboutThis';

const SCALE = [
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Sometimes' },
  { value: 3, label: 'About half' },
  { value: 4, label: 'Often' },
  { value: 5, label: 'Almost always' },
];

export default function AssessmentView({
  chapter,
  assessment,
}: {
  chapter: Chapter;
  assessment: Assessment;
}) {
  const { ready } = useStore();

  if (!ready) {
    return <div className="h-40 animate-pulse rounded-2xl border border-line bg-surface" />;
  }

  if (assessment.kind === 'likert') {
    return <Likert chapter={chapter} assessment={assessment} />;
  }
  if (assessment.kind === 'reflection') {
    return <Reflection chapter={chapter} assessment={assessment} />;
  }
  return <Checklist chapter={chapter} assessment={assessment} />;
}

function Likert({ chapter, assessment }: { chapter: Chapter; assessment: Assessment }) {
  const { chapter: getChapterState, saveAssessment } = useStore();
  const saved = getChapterState(chapter.slug).assessments[assessment.id] ?? {};
  const answers = saved.likertAnswers ?? {};
  const [submitted, setSubmitted] = useState(Boolean(saved.completedAt));

  const answeredAll = assessment.items.every((item) => answers[item.id]);
  const total = useMemo(
    () => Object.values(answers).reduce((a, b) => a + b, 0),
    [answers],
  );
  const band = findResultBand(assessment.resultBands, total);

  const setAnswer = (itemId: string, value: number) =>
    saveAssessment(chapter.slug, assessment.id, {
      likertAnswers: { ...answers, [itemId]: value },
    });

  if (submitted && band) {
    return (
      <div className="rounded-2xl border-2 border-[color:var(--accent)] bg-surface p-5">
        <p className="text-sm uppercase tracking-wide text-body">Your check-in</p>
        <h3 className="mt-1 font-display text-2xl font-semibold">{band.label}</h3>
        <p className="mt-3 leading-relaxed text-body">{band.advice}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="min-h-[48px] rounded-full border border-line px-5 font-semibold text-brand"
          >
            Change my answers
          </button>
          <AskAboutThis
            topic={chapter.slug}
            question={`The ${assessment.title} check-in says ${band.label}. What's one thing I could try this week?`}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-body">{assessment.intro}</p>
      <ol className="space-y-5">
        {assessment.items.map((item, i) => (
          <li key={item.id}>
            <fieldset className="rounded-2xl border border-line bg-surface p-4">
            <legend className="w-full font-medium">
              {i + 1}. {item.text}
            </legend>
            <div className="mt-3 grid grid-cols-5 gap-1.5">
              {SCALE.map((step) => {
                const active = answers[item.id] === step.value;
                return (
                  <label
                    key={step.value}
                    className="cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`${chapter.slug}-${assessment.id}-${item.id}`}
                      value={step.value}
                      checked={active}
                      tabIndex={active || (!answers[item.id] && step.value === 1) ? 0 : -1}
                      onChange={() => setAnswer(item.id, step.value)}
                      onKeyDown={(event) => {
                        let nextValue: number | undefined;
                        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                          nextValue = step.value === 5 ? 1 : step.value + 1;
                        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                          nextValue = step.value === 1 ? 5 : step.value - 1;
                        } else if (event.key === 'Home') {
                          nextValue = 1;
                        } else if (event.key === 'End') {
                          nextValue = 5;
                        }
                        if (!nextValue) return;
                        event.preventDefault();
                        const group = event.currentTarget.closest('fieldset');
                        const next = group?.querySelector<HTMLInputElement>(
                          `input[value="${nextValue}"]`,
                        );
                        setAnswer(item.id, nextValue);
                        next?.focus();
                      }}
                      className="peer sr-only"
                    />
                    <span className="flex min-h-[56px] flex-col items-center justify-center rounded-xl border border-line px-1 text-center text-[11px] leading-tight text-body peer-checked:border-clu-gold peer-checked:bg-clu-gold peer-checked:font-semibold peer-checked:text-clu-purple peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-clu-gold">
                      <span className="text-base font-semibold">{step.value}</span>
                      <span>{step.label}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            </fieldset>
          </li>
        ))}
      </ol>
      <button
        type="button"
        disabled={!answeredAll}
        onClick={() => {
          saveAssessment(chapter.slug, assessment.id, {
            completedAt: new Date().toISOString(),
          });
          setSubmitted(true);
        }}
        className="mt-5 min-h-[48px] w-full rounded-full bg-clu-gold px-5 font-semibold text-clu-purple disabled:opacity-40"
      >
        {answeredAll ? 'See my result' : 'Answer every statement to continue'}
      </button>
    </div>
  );
}

function Reflection({ chapter, assessment }: { chapter: Chapter; assessment: Assessment }) {
  const { chapter: getChapterState, saveAssessment, storageAvailable } = useStore();
  const saved = getChapterState(chapter.slug).assessments[assessment.id] ?? {};
  const [text, setText] = useState(saved.reflectionText ?? '');
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const latestText = useRef(text);
  const lastSavedText = useRef(saved.reflectionText ?? '');

  const persist = useCallback((value: string) => {
    if (value === lastSavedText.current) return;
    saveAssessment(chapter.slug, assessment.id, {
      reflectionText: value,
      reflectionUpdatedAt: new Date().toISOString(),
      completedAt: value.trim() ? new Date().toISOString() : undefined,
    });
    lastSavedText.current = value;
    setSaveStatus('saved');
  }, [assessment.id, chapter.slug, saveAssessment]);

  // Save shortly after typing stops so closing or backgrounding the tab does
  // not depend on the textarea receiving a blur event.
  useEffect(() => {
    latestText.current = text;
    if (text === lastSavedText.current) return;
    setSaveStatus('saving');
    const timeout = window.setTimeout(() => persist(text), 500);
    return () => window.clearTimeout(timeout);
  }, [persist, text]);

  // pagehide covers normal navigation and iOS page suspension. The visibility
  // handler adds an immediate synchronous localStorage attempt on backgrounding.
  useEffect(() => {
    const flush = () => persist(latestText.current);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      flush();
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [persist]);

  return (
    <div>
      <p className="mb-3 text-body">{assessment.intro}</p>
      <blockquote className="mb-4 rounded-2xl border-l-4 border-[color:var(--accent)] bg-surface p-4 text-lg leading-relaxed">
        {assessment.prompt}
      </blockquote>
      <label htmlFor={`reflect-${assessment.id}`} className="sr-only">
        Your reflection
      </label>
      <textarea
        id={`reflect-${assessment.id}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => persist(text)}
        rows={10}
        placeholder="Start writing…"
        className="w-full rounded-2xl border border-line bg-surface p-4 leading-relaxed text-ink placeholder:text-body/60"
      />
      <div className="mt-2 flex items-center justify-between text-sm text-body">
        <span>{text.trim() ? `${text.trim().split(/\s+/).length} words` : ''}</span>
        <span role="status">
          {!storageAvailable
            ? 'Browser storage unavailable — copy your work'
            : saveStatus === 'saving'
              ? 'Saving…'
              : 'Saved on this device only'}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={async () => {
            persist(text);
            const ok = await copyText(text);
            setCopied(ok);
            setTimeout(() => setCopied(false), 2500);
          }}
          disabled={!text.trim()}
          className="min-h-[48px] rounded-full bg-clu-gold px-5 font-semibold text-clu-purple disabled:opacity-40"
        >
          {copied ? 'Copied ✓' : 'Copy my reflection'}
        </button>
        <AskAboutThis
          topic={chapter.slug}
          question={`I'm working on this reflection for ${chapter.title}: "${assessment.prompt ?? ''}". Can you help me think it through?`}
        />
      </div>
      <p className="mt-3 text-sm text-body">
        Your reflections stay on this device — nobody else can see them. Use “Copy” to
        paste yours into Canvas or an email if your instructor asks for it.
      </p>
    </div>
  );
}

function Checklist({ chapter, assessment }: { chapter: Chapter; assessment: Assessment }) {
  const { chapter: getChapterState, saveAssessment } = useStore();
  const saved = getChapterState(chapter.slug).assessments[assessment.id] ?? {};
  const checked = saved.checklist ?? [];

  const toggle = (itemId: string) => {
    const next = checked.includes(itemId)
      ? checked.filter((id) => id !== itemId)
      : [...checked, itemId];
    saveAssessment(chapter.slug, assessment.id, {
      checklist: next,
      completedAt: next.length ? new Date().toISOString() : undefined,
    });
  };

  return (
    <div>
      <p className="mb-3 text-body">{assessment.intro}</p>
      <p className="mb-4 inline-block rounded-full bg-[color:var(--accent)]/15 px-3 py-1 text-sm font-semibold">
        {checked.length} of {assessment.items.length} done
      </p>
      <ul className="space-y-2">
        {assessment.items.map((item) => {
          const done = checked.includes(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-pressed={done}
                className="flex w-full items-start gap-3 rounded-2xl border border-line bg-surface p-4 text-left"
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-md border-2 text-sm font-bold ${
                    done
                      ? 'border-clu-gold bg-clu-gold text-clu-purple'
                      : 'border-line'
                  }`}
                >
                  {done ? '✓' : ''}
                </span>
                <span className={done ? 'text-body line-through' : ''}>{item.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
