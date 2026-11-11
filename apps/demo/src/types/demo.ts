import type { Display, SpritePlacement } from '@cassette-canvas/engine';
import type { FpsMeter } from '../fps/types/fps-meter';
import type { StreetScenery } from '../street/types/street-scenery';

/** Everything the animation loop carries from one frame to the next. */
export interface Demo {
  readonly street: Display;
  readonly hud: Display;
  readonly streetScenery: StreetScenery;
  readonly hudScenery: readonly SpritePlacement[];
  readonly meter: FpsMeter;
}
