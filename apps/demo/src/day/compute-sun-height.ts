import { FULL_TURN } from './consts';

/**
 * Returns how high the sun is at a time of day: -1 at midnight, 0 at 6:00
 * and 18:00, and 1 at noon.
 */
export const computeSunHeight = (phase: number): number =>
  -Math.cos(FULL_TURN * phase);
