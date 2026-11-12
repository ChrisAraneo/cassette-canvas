import { LIGHT_CORE_SHARPNESS } from '../consts';

const computeWindow = (squaredReach: number): number =>
  1 - squaredReach * squaredReach;

/**
 * Returns the share of a light that reaches a point: 1 at its center, 0 at
 * its radius. `squaredReach` is the distance to the light as a share of the
 * radius, squared, from 0 at the center to 1 at the radius. Squared, because
 * then the caller needs no square root, and this runs once per lit pixel.
 *
 * The share thins out with distance the way light spreads out in the world,
 * and a window closes it off smoothly at the radius, so a light leaves a
 * bright core and a long dim halo instead of a flat disc with a visible rim.
 * Callers keep to the center and the radius; a share past 1 means nothing.
 */
export const computeFalloff = (squaredReach: number): number =>
  computeWindow(squaredReach) ** 2 / (1 + LIGHT_CORE_SHARPNESS * squaredReach);
