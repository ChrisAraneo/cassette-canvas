import { times } from 'lodash-es';
import { COLOR_COUNT, COLOR_STRIDE } from '../consts';
import { toLitPixel } from '../to-lit-pixel';

/**
 * The extended pixel each pixel value shows with no light on it, keyed by
 * pixel value. Values that are not pixels are `TRANSPARENT`.
 */
export const AUTHORED_PIXELS: readonly number[] = Object.freeze(
  times(COLOR_COUNT * COLOR_STRIDE, (pixel) => toLitPixel(pixel, 0)),
);
