import type { Sprite } from '@cassette-canvas/engine';

/**
 * One sprite cut out of larger art. `row` and `column` are its offset, in
 * logical pixels, from the top-left pixel of the art.
 */
export interface Tile {
  readonly sprite: Sprite;
  readonly row: number;
  readonly column: number;
}
