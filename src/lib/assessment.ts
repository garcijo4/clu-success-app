import type { ResultBand } from './types';

export function findResultBand(
  resultBands: ResultBand[] | undefined,
  total: number,
): ResultBand | undefined {
  return resultBands?.find((band) => total >= band.min && total <= band.max);
}
