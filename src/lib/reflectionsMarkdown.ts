import type { AppState, Chapter } from './types';
import { findResultBand } from './assessment';

export function buildReflectionsMarkdownFromChapters(
  chapters: Chapter[],
  state: AppState,
  exportedAt: Date = new Date(),
): string {
  const lines: string[] = [];
  const today = exportedAt.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  lines.push('# My College Success Reflections', '', `Exported ${today}`, '');
  let found = 0;

  for (const chapter of chapters) {
    const saved = state.chapters[chapter.slug];
    if (!saved) continue;
    const parts: string[] = [];

    for (const assessment of chapter.assessments) {
      const entry = saved.assessments?.[assessment.id];
      if (!entry) continue;

      if (assessment.kind === 'reflection' && entry.reflectionText?.trim()) {
        found += 1;
        parts.push(`### ${assessment.title}`);
        if (assessment.prompt) parts.push(`> ${assessment.prompt}`);
        parts.push('', entry.reflectionText.trim());
        if (entry.reflectionUpdatedAt) {
          parts.push(
            '',
            `*Written ${new Date(entry.reflectionUpdatedAt).toLocaleDateString()}*`,
          );
        }
        parts.push('');
      }

      if (assessment.kind === 'likert' && entry.likertAnswers) {
        const values = Object.values(entry.likertAnswers);
        if (values.length) {
          found += 1;
          const total = values.reduce((sum, value) => sum + value, 0);
          const band = findResultBand(assessment.resultBands, total);
          parts.push(`### ${assessment.title} (self check-in)`);
          if (band) parts.push(`Result: ${band.label}`);
          parts.push('');
        }
      }

      if (assessment.kind === 'checklist' && entry.checklist?.length) {
        found += 1;
        parts.push(`### ${assessment.title}`);
        for (const item of assessment.items) {
          parts.push(`- [${entry.checklist.includes(item.id) ? 'x' : ' '}] ${item.text}`);
        }
        parts.push('');
      }
    }

    if (parts.length) {
      lines.push(`## Chapter ${chapter.number}: ${chapter.title}`, '', ...parts);
    }
  }

  if (!found) lines.push('_You haven’t written any reflections yet._', '');
  lines.push(
    '---',
    '',
    'Based on *College Success* by Amy Baldwin et al., OpenStax (Rice University), CC BY 4.0. Access for free at openstax.org.',
  );
  return lines.join('\n');
}

export function hasAnySavedWork(chapters: Chapter[], state: AppState): boolean {
  return chapters.some((chapter) => {
    const saved = state.chapters[chapter.slug];
    if (!saved?.assessments) return false;
    return Object.values(saved.assessments).some(
      (entry) =>
        Boolean(entry.reflectionText?.trim()) ||
        Boolean(entry.checklist?.length) ||
        Boolean(entry.likertAnswers && Object.keys(entry.likertAnswers).length),
    );
  });
}
