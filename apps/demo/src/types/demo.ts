import type { Display, Hud, SpritePlacement } from '@cassette-canvas/engine';
import type { FpsMeter } from '../fps/types/fps-meter';
import type { StreetScenery } from '../street/types/street-scenery';

/** Everything the animation loop carries from one frame to the next. */
export interface Demo {
  readonly street: Display;
  readonly chart: Display;
  readonly streetScenery: StreetScenery;
  readonly chartScenery: readonly SpritePlacement[];
  readonly meter: FpsMeter;
  /** The windows over the street. */
  readonly hud: Hud;
  /** How far the HUD's buttons moved the scene's clock, in milliseconds. */
  readonly clock: number;
}
