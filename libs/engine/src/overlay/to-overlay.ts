import { flatMap, map, max, size, times } from 'lodash-es';
import { TRANSPARENT } from '../palette/consts';
import type { SpriteLegend } from '../screen/types/sprite-legend';
import type { Overlay } from './types/overlay';

const toWidth = (rows: readonly string[]): number => max(map(rows, size)) ?? 0;

const toPixels = (
  rows: readonly string[],
  width: number,
  legend: SpriteLegend,
): number[] =>
  flatMap(rows, (row) =>
    times(width, (column) => legend[row[column] ?? ''] ?? TRANSPARENT),
  );

/**
 * Builds an overlay from text art: one string per row, one character per
 * pixel. Each character is looked up in `legend`. The overlay is as wide as
 * the longest row. Characters that are not in the legend, and the places
 * where a row falls short, become transparent.
 */
export const toOverlay = (
  rows: readonly string[],
  legend: SpriteLegend,
): Overlay => ({
  width: toWidth(rows),
  height: size(rows),
  pixels: toPixels(rows, toWidth(rows), legend),
});
