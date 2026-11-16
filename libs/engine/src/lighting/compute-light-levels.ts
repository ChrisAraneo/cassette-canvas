import { pipe } from 'remeda';
import { computeLightExposures } from './internal/compute-light-exposures';
import { computeShadeOffsets } from './internal/compute-shade-offsets';
import type { Lighting } from './types/lighting';

/**
 * Returns how many extended shades the light moves every pixel, row by row
 * from the top left.
 *
 * Lights are combined the way light behaves, not the way numbers add. Each
 * light and the ambient light are turned into amounts of light, those amounts
 * are added together, and the shade is read off the total on a scale where
 * every doubling of light is worth `EXTENDED_SHADES_PER_SHADE` shades. So one
 * light on an unlit scene moves a pixel by exactly its intensity, while a
 * second light of the same intensity adds only one more step, and a lamp in
 * bright daylight barely shows. Nothing adds up to flat white.
 */
export const computeLightLevels = (lighting: Lighting): Float64Array =>
  pipe(lighting, computeLightExposures, (exposures) =>
    computeShadeOffsets(lighting, exposures),
  );
