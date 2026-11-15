import { EXTENDED_SHADES_PER_SHADE } from '../../palette/consts';

/**
 * Returns the amount of light that shows a pixel `shades` extended shades
 * from its authored color. `toExposure(0)` is `REFERENCE_EXPOSURE`, and every
 * `EXTENDED_SHADES_PER_SHADE` shades up double it.
 *
 * Ambient light and light intensities are written in extended shades because
 * that is what you see on screen. This turns one of them back into the amount
 * of light behind it, which is what adds up.
 */
export const toExposure = (shades: number): number =>
  2 ** (shades / EXTENDED_SHADES_PER_SHADE);
