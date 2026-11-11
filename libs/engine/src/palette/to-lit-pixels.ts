/* eslint-disable no-restricted-syntax -- Appendix B exception 1, measured below */
import {
  DARKEST_EXTENDED_SHADE,
  LIGHTEST_EXTENDED_SHADE,
  TRANSPARENT,
} from './consts';
import { SHADE_RAMPS } from './internal/shade-ramps';

// Style guide - Appendix B exception 1 (hot numeric kernel).
// As a pipeline (zipWith over toLitPixel, one match per place), shading the
// demo screen (320x180) took 13.6 ms per frame (Vite bundle, Node 24); with
// lookup tables and no match it still took 2.5 ms. This loop takes 1.2 ms. It
// gives the same pixel as toLitPixel for every place. It only changes the
// array it creates itself, and the array does not change after it returns it.
export const toLitPixels = (
  pixels: ArrayLike<number>,
  shadeOffsets: ArrayLike<number>,
): number[] => {
  const litPixels = new Array<number>(pixels.length);

  for (let index = 0; index < pixels.length; index += 1) {
    const ramp = SHADE_RAMPS[pixels[index] ?? TRANSPARENT];
    const extendedShade = Math.round(
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
