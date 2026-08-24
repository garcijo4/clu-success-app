import type { Assessment, AssessmentState, ResultBand } from './types';

export function findResultBand(
  resultBands: ResultBand[] | undefined,
  total: number,
): ResultBand | undefined {
  return resultBands?.find((band) => total >= band.min && total <= band.max);
}

/**
 * Completion means the student reached the natural end of an activity.
 * A partly checked checklist is useful progress, but it is not "done."
 */
export function isAssessmentComplete(
  assessment: { kind: Assessment['kind']; items: { id: string }[] },
  saved: AssessmentState | undefined,
): boolean {
  if (!saved) return false;
  if (assessment.kind === 'reflection') return Boolean(saved.reflectionText?.trim());
  if (assessment.kind === 'checklist') {
    const checked = new Set(saved.checklist ?? []);
    return assessment.items.length > 0 && assessment.items.every((item) => checked.has(item.id));
  }
  return Boolean(saved.completedAt);
}
