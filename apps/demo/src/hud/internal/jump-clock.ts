import { computeDayCycle } from '../../day/compute-day-cycle';
import type { HudState } from '../types/hud-state';
import { computeClockJump } from './compute-clock-jump';

/**
 * Moves the street clock forward to the next `hour`. `time` is the time of
 * the frame, which the clock is measured from.
 */
export const jumpClock = (
  state: HudState,
  time: number,
  hour: number,
): HudState => ({
  ...state,
  clock:
    state.clock +
    computeClockJump(computeDayCycle(time + state.clock).phase, hour),
});
