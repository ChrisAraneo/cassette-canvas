import type { SpriteLegend } from '@cassette-canvas/engine';

/** Text art padded to whole sprites, one symbol per pixel, with its legend. */
export interface TileArt {
  readonly art: readonly (readonly string[])[];
  readonly legend: SpriteLegend;
}
