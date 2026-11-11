import { isPixel, type SpriteLegend, toSprite } from '@cassette-canvas/engine';
import {
  ceil,
  chunk,
  filter,
  flatMap,
  join,
  map,
  max,
  padEnd,
  range,
  size,
  slice,
  some,
  split,
  times,
} from 'lodash-es';
import { pipe } from 'remeda';
import { SPRITE_SIZE } from '../consts';
import type { Tile } from './types/tile';

const BLANK = '.';

const toTileSpan = (length: number): number =>
  ceil(length / SPRITE_SIZE) * SPRITE_SIZE;

const padRows = (rows: readonly string[], width: number): string[][] =>
  times(toTileSpan(size(rows)), (index) =>
    split(padEnd(rows[index] ?? '', width, BLANK), ''),
  );

const padArt = (rows: readonly string[]): string[][] =>
  padRows(rows, toTileSpan(max(map(rows, size)) ?? 0));

const cutSprite = (
  band: readonly string[][],
  column: number,
  legend: SpriteLegend,
): Tile['sprite'] =>
  toSprite(
    map(band, (symbols) =>
      join(slice(symbols, column, column + SPRITE_SIZE), ''),
    ),
    legend,
  );

const cutBand = (
  band: readonly string[][],
  bandIndex: number,
  legend: SpriteLegend,
): Tile[] =>
  map(range(0, size(band[0]), SPRITE_SIZE), (column) => ({
    sprite: cutSprite(band, column, legend),
    row: bandIndex * SPRITE_SIZE,
    column,
  }));

/**
 * Cuts text art of any size into sprite-sized tiles, left to right and top
 * to bottom. Short rows and a short last band are padded with transparent
 * pixels. Tiles with no visible pixel are left out.
 */
export const toTiles = (
  rows: readonly string[],
  legend: SpriteLegend,
): Tile[] =>
  pipe(
    padArt(rows),
    (art) =>
      flatMap(chunk(art, SPRITE_SIZE), (band, bandIndex) =>
        cutBand(band, bandIndex, legend),
      ),
    (tiles) => filter(tiles, (tile) => some(tile.sprite, isPixel)),
  );
