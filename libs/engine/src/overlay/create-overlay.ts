import { constant, times } from 'lodash-es';
import { TRANSPARENT } from '../palette/consts';
import { toCount } from './to-count';
import type { Overlay } from './types/overlay';

/**
 * Creates an overlay of `width` by `height` logical pixels, filled with one
 * pixel value. The default is `TRANSPARENT`, which draws nothing. A width or
 * height below 1 returns an empty overlay.
 */
export const createOverlay = (
  width: number,
  height: number,
  pixel: number = TRANSPARENT,
): Overlay => ({
  width: toCount(width),
  height: toCount(height),
  pixels: times(toCount(width) * toCount(height), constant(pixel)),
});
