import { HOUR_LENGTH } from '../consts';
import type { HudState } from '../types/hud-state';

/**
 * Moves the street clock on by an hour, from wherever the buttons left it.
 * Returns a new state.
 */
export const patchHudStateHour = (state: HudState): HudState => ({
  ...state,
  clock: state.clock + HOUR_LENGTH,
});
