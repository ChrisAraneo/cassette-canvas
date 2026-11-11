import type { SpriteLegend } from '@cassette-canvas/engine';

/**
 * A building that stands on the sidewalk. `grid` holds one string per row
 * of tiles, top to bottom, with one facade code per tile (see
 * `FACADE_ARTS`). A space leaves the tile empty. `legend` paints it.
 */
export interface Building {
  readonly id: string;
  readonly column: number;
  readonly grid: readonly string[];
  readonly legend: SpriteLegend;
}
