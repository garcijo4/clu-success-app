import assert from 'node:assert/strict';
import test from 'node:test';
import { chapters } from '../src/content';

test('content inventory and IDs remain structurally valid', () => {
  assert.equal(chapters.length, 12);
  assert.equal(chapters.reduce((sum, chapter) => sum + chapter.flashcards.length, 0), 192);
  assert.equal(chapters.reduce((sum, chapter) => sum + chapter.assessments.length, 0), 36);
  for (const chapter of chapters) {
    const ids = chapter.flashcards.map((card) => card.id);
    assert.equal(new Set(ids).size, ids.length, `duplicate flashcard ID in ${chapter.slug}`);
  }
});

test('every Likert assessment covers its entire possible range without gaps or overlaps', () => {
  for (const chapter of chapters) {
    for (const assessment of chapter.assessments.filter((item) => item.kind === 'likert')) {
      const bands = [...(assessment.resultBands ?? [])].sort((a, b) => a.min - b.min);
      assert.ok(bands.length, `${assessment.id} has no result bands`);
      assert.equal(bands[0].min, assessment.items.length, `${assessment.id} starts incorrectly`);
      for (let index = 1; index < bands.length; index += 1) {
        assert.equal(
          bands[index].min,
          bands[index - 1].max + 1,
          `${assessment.id} has a gap or overlap`,
        );
      }
      assert.equal(
        bands[bands.length - 1].max,
        assessment.items.length * 5,
        `${assessment.id} ends incorrectly`,
      );
    }
  }
});

test('health chapter avoids prohibited screening and crisis content', () => {
  const health = JSON.stringify(chapters.find((chapter) => chapter.number === 11)).toLowerCase();
  for (const phrase of ['suicide', 'self-harm', 'disordered eating', 'eating disorder']) {
    assert.equal(health.includes(phrase), false, `health chapter contains ${phrase}`);
  }
  assert.equal(health.includes('screening tool'), false);
});
