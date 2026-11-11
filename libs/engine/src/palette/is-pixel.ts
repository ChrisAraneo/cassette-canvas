import { isUndefined } from 'lodash-es';
import { SHADE_RAMPS } from './internal/shade-ramps';

/**
 * Returns `true` if the number is a pixel the palette can draw: a color from
 * 0 to 15 in the high hex digit and a shade from 0 to 7 in the low hex digit.
 * Returns `false` for `TRANSPARENT` and all other values.
 */
export const isPixel = (pixel: number): boolean =>
  !isUndefined(SHADE_RAMPS[pixel]);
