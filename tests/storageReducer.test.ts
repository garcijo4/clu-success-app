import assert from 'node:assert/strict';
import test from 'node:test';
import {
  emptyAppState,
  normalizeAppState,
  parseStoredState,
  storageReducer,
} from '../src/lib/storageReducer';

test('flashcard reducer increments misses, removes mastered cards, and clears tricky state', () => {
  let state = emptyAppState();
  state = storageReducer(state, {
    type: 'mark-review-again',
    slug: 'chapter',
    cardId: 'card-1',
  });
  state = storageReducer(state, {
    type: 'mark-review-again',
    slug: 'chapter',
    cardId: 'card-1',
  });
  assert.equal(state.chapters.chapter.reviewAgainCounts['card-1'], 2);

  state = storageReducer(state, {
    type: 'mark-got-it',
    slug: 'chapter',
    cardId: 'card-1',
  });
  assert.deepEqual(state.chapters.chapter.flashcardsGotIt, ['card-1']);
  assert.equal(state.chapters.chapter.reviewAgainCounts['card-1'], undefined);
});

test('truncated localStorage JSON resets safely without treating storage as blocked', () => {
  assert.deepEqual(parseStoredState('{"version":1,"chapters":'), emptyAppState());
  assert.deepEqual(parseStoredState(null), emptyAppState());
});

test('normalizer safely repairs valid JSON with malformed nested fields', () => {
  const state = normalizeAppState({
    version: 1,
    theme: 'neon',
    chapters: {
      chapter: {
        flashcardsGotIt: ['card-1', 42, 'card-1'],
        reviewAgainCounts: { 'card-1': 2, broken: 'many', negative: -1 },
        assessments: { reflection: { reflectionText: 'Kept', checklist: 'bad' } },
      },
      invalid: 'not an object',
    },
  });

  assert.deepEqual(state.chapters.chapter.flashcardsGotIt, ['card-1']);
  assert.deepEqual(state.chapters.chapter.reviewAgainCounts, { 'card-1': 2 });
  assert.equal(state.chapters.chapter.assessments.reflection.reflectionText, 'Kept');
  assert.equal(state.chapters.invalid, undefined);
  assert.equal(state.theme, undefined);
});
