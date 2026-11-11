import { toFraction } from './to-fraction';

const HASH_SCALE = 12.9898;

const HASH_SPREAD = 43758.5453;

/**
 * Turns a seed into a number from 0 to 1 that looks random. The same seed
 * always gives the same number, so the scene is the same on every run.
 */
export const computeHash = (seed: number): number =>
  toFraction(Math.sin(seed * HASH_SCALE) * HASH_SPREAD);
