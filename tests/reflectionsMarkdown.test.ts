import assert from 'node:assert/strict';
import test from 'node:test';
import type { AppState, Chapter } from '../src/lib/types';
import { buildReflectionsMarkdownFromChapters } from '../src/lib/reflectionsMarkdown';

const chapter: Chapter = {
  slug: 'chapter', number: 1, title: 'Starting', studentSubtitle: '',
  themeColor: '#1E5989', themeColorDark: '#4796C1', blurb: '', keyIdeas: [],
  summary: [],
  sections: [], openstaxUrl: '', flashcards: [],
  assessments: [
    {
      id: 'reflection', title: 'My reflection', kind: 'reflection', estMinutes: 2,
      intro: '', items: [], prompt: 'What will you try?',
    },
    {
      id: 'check-in', title: 'My check-in', kind: 'likert', estMinutes: 2,
      intro: '', items: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }],
      resultBands: [{ min: 2, max: 10, label: 'An area to grow', advice: '' }],
    },
  ],
};

test('reflection export includes writing, result band, and attribution without a score', () => {
  const state: AppState = {
    version: 1,
    chapters: {
      chapter: {
        flashcardsGotIt: [], reviewAgainCounts: {},
        assessments: {
          reflection: { reflectionText: 'I will ask for help early.' },
          'check-in': { likertAnswers: { a: 1, b: 2 } },
        },
      },
    },
  };
  const markdown = buildReflectionsMarkdownFromChapters(
    [chapter], state, new Date('2026-08-23T12:00:00Z'),
  );
  assert.match(markdown, /I will ask for help early\./);
  assert.match(markdown, /Result: An area to grow/);
  assert.doesNotMatch(markdown, /Score:/);
  assert.match(markdown, /CC BY 4\.0/);
});
