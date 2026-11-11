import type { SpritePlacement } from '@cassette-canvas/engine';
import { map } from 'lodash-es';
import type { Tile } from './types/tile';

/**
 * Places tiled art with its top-left pixel at `row` and `column`. Each tile
 * gets its own id: the art's id followed by the tile's offset.
 */
export const placeTiles = (
  tiles: readonly Tile[],
  { id, row, column, castsShadow }: Omit<SpritePlacement, 'sprite'>,
): SpritePlacement[] =>
  map(tiles, (tile) => ({
    id: `${id}-${tile.row}-${tile.column}`,
    sprite: tile.sprite,
    row: row + tile.row,
    column: column + tile.column,
    castsShadow,
  }));
