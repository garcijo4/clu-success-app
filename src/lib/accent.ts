import type { CSSProperties } from 'react';

type AccentProperties = CSSProperties & Record<`--${string}`, string>;

function channel(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const value = hex.replace('#', '');
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
}

function contrast(first: string, second: string): number {
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function readableAccentText(accent: string, surface: string, fallback: string): string {
  return contrast(accent, surface) >= 4.5 ? accent : fallback;
}

export function accentStyle(light: string, dark: string): AccentProperties {
  return {
    '--accent-light': light,
    '--accent-dark': dark,
    '--accent-text-light': readableAccentText(light, '#FFFFFF', '#3B2360'),
    '--accent-text-dark': readableAccentText(dark, '#1E1A2A', '#FFD589'),
  };
}
