import { flatMap, map, split } from 'lodash-es';
import { TRANSPARENT } from '../palette/consts';
import type { Sprite } from './types/sprite';
import type { SpriteLegend } from './types/sprite-legend';

/**
 * Builds a sprite from text art: one string per row, one character per
 * pixel. Each character is looked up in `legend`. Characters that are not in
 * the legend become transparent.
 */
export const toSprite = (
  rows: readonly string[],
  legend: SpriteLegend,
): Sprite =>
  flatMap(rows, (row) =>
    map(split(row, ''), (symbol) => legend[symbol] ?? TRANSPARENT),
  );
