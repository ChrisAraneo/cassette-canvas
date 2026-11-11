import type { Tile } from '../../tiles/types/tile';

/**
 * Tiled art that travels along a row and wraps around: it leaves one edge of
 * the screen and comes back from the other one.
 */
export interface Mover {
  readonly id: string;
  /** The animation frames, played in order and then again. */
  readonly frames: readonly (readonly Tile[])[];
  readonly row: number;
  /** Logical pixels per second. A negative speed moves left. */
  readonly speed: number;
  /** How far along its track it is when the animation starts. */
  readonly offset: number;
  /** How long each frame shows, in milliseconds. */
  readonly frameDuration: number;
  readonly castsShadow: boolean;
}
