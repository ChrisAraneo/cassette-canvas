import type { SpritePlacement } from '@cassette-canvas/engine';

/** The glow of one window, and when it shows. */
export interface LitWindow {
  readonly placements: readonly SpritePlacement[];
  /** How dark it must be before the light goes on, from 0 to 1. */
  readonly dusk: number;
  /** When the light goes off, in hours after noon. */
  readonly bedtime: number;
}
