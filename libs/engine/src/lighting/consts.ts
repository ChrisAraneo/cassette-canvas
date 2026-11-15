import {
  EXTENDED_SHADE_COUNT,
  EXTENDED_SHADES_PER_SHADE,
} from '../palette/consts';

/** The amount of light that shows a pixel in its authored color. */
export const REFERENCE_EXPOSURE = 1;

/**
 * The most light can move a pixel, in extended shades: a whole ramp in either
 * direction, which is more than any pixel needs, because every pixel stops at
 * the darkest or the lightest extended shade well before this.
 */
export const MIN_SHADE_OFFSET = -EXTENDED_SHADE_COUNT;

export const MIN_EXPOSURE = 2 ** (MIN_SHADE_OFFSET / EXTENDED_SHADES_PER_SHADE);

export const MAX_EXPOSURE =
  2 ** (EXTENDED_SHADE_COUNT / EXTENDED_SHADES_PER_SHADE);

/**
 * How much of the light at a pixel comes from each side of the pixel ahead
 * of it, toward the light, rather than all of it from that one pixel. It
 * adds a penumbra to every shadow: its edge ramps from full light to full
 * shadow over two pixels instead of stepping down in one, the way an edge
 * looks under a light that is not a single point.
 *
 * Only the edge softens. What blocks a light still blocks it, so the middle
 * of a shadow stays as dark as before, and a shadow never fades out with
 * distance. At `0` the edges are as hard as under a point source, and
 * `0.25` spreads the ramp evenly, which is as soft as three pixels go.
 */
export const SHADOW_SOFTNESS = 0.25;

/**
 * How sharply a light's core outshines its rim. A light thins out with
 * distance like `1 / (1 + this * squaredReach)`, where `squaredReach` runs
 * from 0 at the center to 1 at the radius, the way light spreads out in the
 * world. So a lamp keeps a bright core and a long dim halo instead of a flat
 * disc.
 */
export const LIGHT_CORE_SHARPNESS = 8;
