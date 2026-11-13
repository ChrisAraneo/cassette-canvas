import type { Hud } from '@cassette-canvas/engine';

/** The part of the demo the HUD can change. */
export interface HudState {
  readonly hud: Hud;
  /** How far the buttons moved the street clock, in milliseconds. */
  readonly clock: number;
}
