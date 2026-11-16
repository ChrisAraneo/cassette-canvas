/* eslint-disable no-restricted-syntax -- Appendix B exception 1, measured below */
import { round, size } from 'lodash-es';
import {
  DARKEST_EXTENDED_SHADE,
  LIGHTEST_EXTENDED_SHADE,
  TRANSPARENT,
} from './consts';
import { SHADE_RAMPS } from './internal/shade-ramps';

// Style guide - Appendix B exception 1 (hot numeric kernel).
// As a pipeline (`zipWith` over `toLitPixel`, one `match` per place), shading
// a 320x180 screen took 13.6 ms per frame (Vite bundle, Node 24); with lookup
// tables and no `match` it still took 2.5 ms. This loop takes 1.2 ms. It
// returns the same pixel as `toLitPixel` for every place. It only changes the
// array it creates itself, and the array does not change after it returns it.
export const toLitPixels = (
  pixels: ArrayLike<number>,
  shadeOffsets: ArrayLike<number>,
): number[] => {
  const count = size(pixels);
  const litPixels = new Array<number>(count);

  for (let index = 0; index < count; index += 1) {
    const ramp = SHADE_RAMPS[pixels[index] ?? TRANSPARENT];
    const extendedShade = round(
      (ramp?.extendedShade ?? 0) + (shadeOffsets[index] ?? 0),
    );

    litPixels[index] =
      ramp?.pixels[
        Math.min(
          LIGHTEST_EXTENDED_SHADE,
          Math.max(DARKEST_EXTENDED_SHADE, extendedShade),
        )
      ] ?? TRANSPARENT;
  }

  return litPixels;
};
