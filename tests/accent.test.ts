import assert from 'node:assert/strict';
import test from 'node:test';
import { chapters } from '../src/content';
import { accentStyle } from '../src/lib/accent';

function luminance(hex: string): number {
  const values = hex
    .replace('#', '')
    .match(/.{2}/g)!
    .map((part) => Number.parseInt(part, 16) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
}

function contrast(first: string, second: string): number {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test('chapter accent text passes AA on card surfaces in both themes', () => {
  for (const chapter of chapters) {
    const style = accentStyle(chapter.themeColor, chapter.themeColorDark);
    assert.ok(
      contrast(style['--accent-text-light'], '#FFFFFF') >= 4.5,
      `${chapter.slug} light accent text fails`,
    );
    assert.ok(
      contrast(style['--accent-text-dark'], '#1E1A2A') >= 4.5,
      `${chapter.slug} dark accent text fails`,
    );
  }
});

test('brand link colors pass AA on light and dark surfaces', () => {
  assert.ok(contrast('#3B2360', '#FFFFFF') >= 4.5, 'light brand link fails');
  assert.ok(contrast('#FFD589', '#1E1A2A') >= 4.5, 'dark gold link fails');
});
