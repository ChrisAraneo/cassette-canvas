import { clamp, round } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { EXTENDED_SHADE_COUNT, TRANSPARENT } from './consts';
import { SHADE_RAMPS } from './internal/shade-ramps';

const { nonNullable } = P;

const DARKEST_EXTENDED_SHADE = 0;

const LIGHTEST_EXTENDED_SHADE = EXTENDED_SHADE_COUNT - 1;

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
    .with(
      nonNullable,
      ({ pixels, extendedShade }) =>
        pixels[
          clamp(
            round(extendedShade + shadeOffset),
            DARKEST_EXTENDED_SHADE,
            LIGHTEST_EXTENDED_SHADE,
          )
        ] ?? TRANSPARENT,
    )
    .otherwise(() => TRANSPARENT);
