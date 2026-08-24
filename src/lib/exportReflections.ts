'use client';

// "Download all my reflections" (design plan §4.2a).
// Everything is assembled client-side; nothing is uploaded.

import type { AppState } from './types';
import {
  buildReflectionsMarkdownFromChapters,
  hasAnySavedWork,
  type ReflectionExportChapter,
} from './reflectionsMarkdown';

export function buildReflectionsMarkdown(
  chapters: ReflectionExportChapter[],
  state: AppState,
  exportedAt: Date = new Date(),
): string {
  return buildReflectionsMarkdownFromChapters(chapters, state, exportedAt);
}

export function hasAnyReflections(
  chapters: ReflectionExportChapter[],
  state: AppState,
): boolean {
  return hasAnySavedWork(chapters, state);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission-denied and older-browser paths continue to the local fallback.
  }

  try {
    const active = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.readOnly = true;
    textarea.setAttribute('aria-hidden', 'true');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    active?.focus();
    return copied;
  } catch {
    return false;
  }
}
