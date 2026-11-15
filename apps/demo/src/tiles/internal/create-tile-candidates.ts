import { type SpriteLegend, toSprite } from '@cassette-canvas/engine';
import { flatMap, join, map, range, size, slice } from 'lodash-es';
import { SPRITE_SIZE } from '../../consts';
import type { Tile } from '../types/tile';
import type { TileBands } from './types/tile-bands';
import type { TileCandidates } from './types/tile-candidates';

const toTileSprite = (
  band: readonly (readonly string[])[],
  column: number,
  legend: SpriteLegend,
): Tile['sprite'] =>
  toSprite(
    map(band, (symbols) =>
      join(slice(symbols, column, column + SPRITE_SIZE), ''),
    ),
    legend,
  );

const createBandTiles = (
  band: readonly (readonly string[])[],
  bandIndex: number,
  legend: SpriteLegend,
): readonly Tile[] =>
  map(range(0, size(band[0]), SPRITE_SIZE), (column) => ({
    sprite: toTileSprite(band, column, legend),
    row: bandIndex * SPRITE_SIZE,
    column,
  }));

/** Cuts every band into sprite-sized tiles, left to right. */
export const createTileCandidates = ({
  bands,
  legend,
}: TileBands): TileCandidates => ({
  candidates: flatMap(bands, (band, bandIndex) =>
    createBandTiles(band, bandIndex, legend),
  ),
});
