import { flatMap, map, split } from 'lodash-es';
import { TRANSPARENT } from '../palette/consts';
import type { SpriteLegend } from '../palette/types/sprite-legend';
import type { Sprite } from './types/sprite';

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
    map(split(row, ''), (character) => legend[character] ?? TRANSPARENT),
  );
