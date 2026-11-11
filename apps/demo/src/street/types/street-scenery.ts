import type { SpritePlacement } from '@cassette-canvas/engine';
import type { LitWindow } from './lit-window';

/** The parts of the street that do not move, made once. */
export interface StreetScenery {
  readonly skyline: readonly SpritePlacement[];
  readonly nightSkyline: readonly SpritePlacement[];
  readonly buildings: readonly SpritePlacement[];
  readonly windows: readonly LitWindow[];
  readonly sidewalk: readonly SpritePlacement[];
  readonly road: readonly SpritePlacement[];
}
