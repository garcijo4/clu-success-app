import assert from 'node:assert/strict';
import test from 'node:test';
import type { Chapter } from '../src/lib/types';
import { buildQuickReviewDeck } from '../src/lib/quickReview';
import { emptyAppState, storageReducer } from '../src/lib/storageReducer';

function chapter(slug: string, number: number, cardIds: string[]): Chapter {
  return {
    slug,
    number,
    title: slug,
    studentSubtitle: '',
    themeColor: '#1E5989',
    themeColorDark: '#4796C1',
    blurb: '',
    keyIdeas: [],
    sections: [],
    openstaxUrl: '',
    flashcards: cardIds.map((id) => ({ id, front: id, back: id })),
    assessments: [],
  };
}

const chapters = [
  chapter('exploring-college', 1, ['tricky', 'started']),
  chapter('learning-styles', 2, ['fresh-2']),
  chapter('time-and-priorities', 3, ['fresh-3']),
  chapter('later', 4, ['later']),
];

test('Quick Review prioritizes tricky, then unfinished started, then unseen cards', () => {
  let state = emptyAppState();
  state = storageReducer(state, {
    type: 'mark-review-again', slug: 'exploring-college', cardId: 'tricky',
  });
  state = storageReducer(state, {
    type: 'mark-review-again', slug: 'exploring-college', cardId: 'tricky',
  });
  const deck = buildQuickReviewDeck(chapters, state, 4, () => 0.999);
  assert.deepEqual(deck.map((card) => card.id), ['tricky', 'started', 'fresh-2', 'fresh-3']);
});

test('a fresh install samples only chapters 1–3', () => {
  const deck = buildQuickReviewDeck(chapters, emptyAppState(), 10, () => 0.999);
  assert.equal(deck.some((card) => card.chapterSlug === 'later'), false);
  assert.equal(deck.length, 4);
});
