import { match } from 'ts-pattern';
import { COLOR_COUNT, COLOR_STRIDE, SHADE_COUNT, TRANSPARENT } from './consts';
import { isIndex } from './internal/is-index';

/**
 * Returns the pixel value for a color (0 to 15) and a shade (0 to 7):
 * `toPixel(3, 5)` is `0x35`. Returns `TRANSPARENT` for out-of-range input.
 */
export const toPixel = (color: number, shade: number): number =>
  match(isIndex(color, COLOR_COUNT) && isIndex(shade, SHADE_COUNT))
    .with(true, () => color * COLOR_STRIDE + shade)
    .otherwise(() => TRANSPARENT);
