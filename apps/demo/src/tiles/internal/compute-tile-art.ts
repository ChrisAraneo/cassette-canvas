import type { SpriteLegend } from '@cassette-canvas/engine';
import { ceil, map, max, padEnd, size, split, times } from 'lodash-es';
import { SPRITE_SIZE } from '../../consts';
import { BLANK } from '../consts';
import type { TileArt } from './types/tile-art';

const toTileSpan = (length: number): number =>
  ceil(length / SPRITE_SIZE) * SPRITE_SIZE;

/**
 * Pads the art to whole sprites, right and bottom, and splits every row into
 * one symbol per logical pixel.
 */
export const computeTileArt = ({
  rows,
  legend,
}: {
  readonly rows: readonly string[];
  readonly legend: SpriteLegend;
}): TileArt => ({
  art: times(toTileSpan(size(rows)), (index) =>
    split(
      padEnd(rows[index] ?? '', toTileSpan(max(map(rows, size)) ?? 0), BLANK),
      '',
    ),
  ),
  legend,
});
