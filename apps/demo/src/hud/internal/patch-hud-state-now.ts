import { START_CLOCK } from '../consts';
import type { HudState } from '../types/hud-state';

/**
 * Puts the street clock back where it started, so the street follows the
 * animation's own time again. Returns a new state.
 */
export const patchHudStateNow = (state: HudState): HudState => ({
  ...state,
  clock: START_CLOCK,
});
