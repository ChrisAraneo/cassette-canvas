import { match, P } from 'ts-pattern';
import { TRANSPARENT } from './consts';
import { SHADE_RAMPS } from './internal/shade-ramps';
import { toRampPixel } from './internal/to-ramp-pixel';

const { nonNullable } = P;

/**
 * Returns the extended pixel that a pixel shows under light. The color stays
 * the same. The shade moves `shadeOffset` extended shades up or down
 * (4 extended shades = 1 sprite shade). The result is rounded and stops at
 * the darkest and lightest extended shade. `toLitPixel(pixel, 0)` returns
 * the authored color. Returns `TRANSPARENT` for `TRANSPARENT` and for any
 * value that is not a pixel.
 */
export const toLitPixel = (pixel: number, shadeOffset: number): number =>
  match(SHADE_RAMPS[pixel])
    .with(nonNullable, (ramp) => toRampPixel(ramp, shadeOffset))
    .otherwise(() => TRANSPARENT);
