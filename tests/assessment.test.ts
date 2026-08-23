import assert from 'node:assert/strict';
import test from 'node:test';
import { findResultBand } from '../src/lib/assessment';

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
