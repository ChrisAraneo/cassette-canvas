import { match } from 'ts-pattern';
import { COLOR_COUNT, EXTENDED_SHADE_COUNT, TRANSPARENT } from './consts';
import { isIndex } from './internal/is-index';

/**
 * Returns the extended pixel for a color (0 to 15) and an extended shade
 * (0 to 31): `color * 32 + extendedShade`. Lit frames hold extended pixels,
 * and the palette is keyed by them.
 *
 * Sprite shade `s` is extended shade `4 * s + 1`. Extended shades 0, 30, and
 * 31 are outside the sprite shades; only light reaches them. Returns
 * `TRANSPARENT` for out-of-range input.
 */
export const toExtendedPixel = (color: number, extendedShade: number): number =>
  match(
    isIndex(color, COLOR_COUNT) && isIndex(extendedShade, EXTENDED_SHADE_COUNT),
  )
    .with(true, () => color * EXTENDED_SHADE_COUNT + extendedShade)
    .otherwise(() => TRANSPARENT);
