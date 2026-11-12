import { map } from 'lodash-es';
import { computeLightExposure } from './internal/compute-light-exposure';
import { computeShadeOffsets } from './internal/compute-shade-offsets';
import type { Lighting } from './types/lighting';

/**
 * Returns how many extended shades the light moves every pixel, row by row
 * from the top left.
 *
 * Lights are combined the way light behaves, not the way numbers add. Each
 * light and the ambient light are turned into amounts of light, those amounts
 * are added together, and the shade is read off the total on a scale where
 * every doubling of light is worth `EXTENDED_SHADES_PER_STOP` shades. So one
 * light on an unlit scene moves a pixel by exactly its intensity, while a
 * second light of the same intensity adds only one more step, and a lamp in
 * bright daylight barely shows. Nothing stacks up into flat white.
 */
export const computeLightLevels = (lighting: Lighting): Float64Array =>
  computeShadeOffsets(
    lighting,
    map(lighting.lights, (light) => computeLightExposure(lighting, light)),
  );
