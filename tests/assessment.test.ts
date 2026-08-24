import assert from 'node:assert/strict';
import test from 'node:test';
import { findResultBand, isAssessmentComplete } from '../src/lib/assessment';
import type { Assessment } from '../src/lib/types';

const bands = [
  { min: 3, max: 6, label: 'Grow', advice: '' },
  { min: 7, max: 11, label: 'Building', advice: '' },
  { min: 12, max: 15, label: 'Working', advice: '' },
];

test('Likert band lookup includes every boundary', () => {
  assert.equal(findResultBand(bands, 3)?.label, 'Grow');
  assert.equal(findResultBand(bands, 6)?.label, 'Grow');
  assert.equal(findResultBand(bands, 7)?.label, 'Building');
  assert.equal(findResultBand(bands, 15)?.label, 'Working');
  assert.equal(findResultBand(bands, 16), undefined);
});

test('activity completion follows the natural end of each activity kind', () => {
  const checklist: Assessment = {
    id: 'checklist',
    title: 'Checklist',
    kind: 'checklist',
    estMinutes: 2,
    intro: '',
    items: [{ id: 'one', text: 'One' }, { id: 'two', text: 'Two' }],
  };
  assert.equal(isAssessmentComplete(checklist, { checklist: ['one'] }), false);
  assert.equal(isAssessmentComplete(checklist, { checklist: ['one', 'two'] }), true);

  const reflection: Assessment = { ...checklist, kind: 'reflection', items: [] };
  assert.equal(isAssessmentComplete(reflection, { reflectionText: '   ' }), false);
  assert.equal(isAssessmentComplete(reflection, { reflectionText: 'A thought' }), true);

  const likert: Assessment = { ...checklist, kind: 'likert' };
  assert.equal(isAssessmentComplete(likert, { likertAnswers: { one: 5 } }), false);
  assert.equal(isAssessmentComplete(likert, { completedAt: '2026-08-23' }), true);
});
