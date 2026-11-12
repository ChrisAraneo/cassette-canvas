import {
  EXTENDED_SHADES_PER_STOP,
  MAX_EXPOSURE,
  MIN_EXPOSURE,
} from '../consts';

/**
 * Returns how many extended shades an amount of light moves a pixel from its
 * authored color. This undoes `toExposure`: `REFERENCE_EXPOSURE` gives 0,
 * twice as much light gives `EXTENDED_SHADES_PER_STOP` more shades, and half
 * as much gives that many fewer. Light beyond what a pixel can show stops at
 * the ends of the scale.
 *
 * Because every doubling costs the same number of shades, a scene that is
 * already bright barely shows one more lamp, while the same lamp in the dark
 * shows in full. That is how the eye reads brightness, and it is why lights
 * no longer stack up into white.
 *
 * It clamps with `Math.min` and `Math.max` rather than `clamp`, because it
 * runs once per lit pixel.
 */
export const toShadeOffset = (exposure: number): number =>
  EXTENDED_SHADES_PER_STOP *
  Math.log2(Math.min(MAX_EXPOSURE, Math.max(MIN_EXPOSURE, exposure)));
