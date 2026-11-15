import type { SpriteLegend } from '@cassette-canvas/engine';
import { pipe } from 'remeda';
import { computeTileArt } from './internal/compute-tile-art';
import { computeTileBands } from './internal/compute-tile-bands';
import { createTileCandidates } from './internal/create-tile-candidates';
import { filterDrawnTiles } from './internal/filter-drawn-tiles';
import type { Tile } from './types/tile';

/**
 * Cuts text art of any size into sprite-sized tiles, left to right and top
 * to bottom. Short rows and a short last band are padded with transparent
 * pixels. Tiles with no visible pixel are left out.
 */
export const toTiles = (
  rows: readonly string[],
  legend: SpriteLegend,
): readonly Tile[] =>
  pipe(
    { rows, legend },
    computeTileArt,
    computeTileBands,
    createTileCandidates,
    filterDrawnTiles,
  );
