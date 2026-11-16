import { flatMap, times } from 'lodash-es';
import { TRANSPARENT } from '../../palette/consts';
import type { SpriteLegend } from '../../palette/types/sprite-legend';

export const toOverlayPixels = (
  rows: readonly string[],
  width: number,
  legend: SpriteLegend,
): number[] =>
  flatMap(rows, (row) =>
    times(width, (column) => legend[row[column] ?? ''] ?? TRANSPARENT),
  );
