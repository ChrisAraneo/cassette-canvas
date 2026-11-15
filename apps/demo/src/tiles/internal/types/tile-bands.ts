import type { SpriteLegend } from '@cassette-canvas/engine';

/** The padded art cut into bands one sprite tall, with its legend. */
export interface TileBands {
  readonly bands: readonly (readonly (readonly string[])[])[];
  readonly legend: SpriteLegend;
}
