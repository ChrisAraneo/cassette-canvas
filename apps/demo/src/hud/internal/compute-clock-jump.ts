import { DAY_LENGTH, HOURS_PER_DAY } from '../../day/consts';
import { toFraction } from '../../math/to-fraction';

/**
 * Returns how far the clock has to move for the street to show `hour`, from
 * the time of day it shows now. The jump always goes forward, by at most a
 * whole day.
 */
export const computeClockJump = (phase: number, hour: number): number =>
  DAY_LENGTH * toFraction(hour / HOURS_PER_DAY - phase);
