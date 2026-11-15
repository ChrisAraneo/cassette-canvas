import type { Tile } from '../../types/tile';

/** Every tile the art was cut into, before the blank ones are dropped. */
export interface TileCandidates {
  readonly candidates: readonly Tile[];
}
