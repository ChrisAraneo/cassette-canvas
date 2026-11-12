/* eslint-disable no-restricted-syntax -- Appendix B exception 1, measured below */
import type { Lighting } from '../types/lighting';
import { toExposure } from './to-exposure';
import { toShadeOffset } from './to-shade-offset';

/**
 * Adds up the ambient light and every light that reaches a pixel, then reads
 * off how many extended shades that much light moves the pixel.
 *
 * The amounts of light are added, not the shades. Two lamps on one spot are
 * twice the light, which is one shade step more than one lamp, not twice as
 * many shade steps, and a lamp in daylight hardly tells at all. That is why
 * a lit scene keeps its shading instead of washing out to white.
 */
// Style guide - Appendix B exception 1 (hot numeric kernel).
// As a pipeline (times, with a sumBy over the lights for every place), the
// demo screen at night (320x180, 11 lights) took 6.8 ms per frame (Vite
// bundle, Node 24). This loop takes 1.2 ms, and 0.28 ms at noon, where one
// light covers a small part of the screen. Places that no light reaches skip
// the shade scale: the ambient light on its own always reads back as itself,
// so skipping it saves 0.4 ms a frame at night and keeps the value exact. It
// only changes the typed array it creates itself, and the array does not
// change after it returns it.
export const computeShadeOffsets = (
  { ambient, width, height }: Lighting,
  exposures: readonly Float32Array[],
): Float64Array => {
  const offsets = new Float64Array(Math.max(0, width * height));
  const ambientExposure = toExposure(ambient);

  for (const exposure of exposures) {
    for (let index = 0; index < offsets.length; index += 1) {
      offsets[index] = (offsets[index] ?? 0) + (exposure[index] ?? 0);
    }
  }

  for (let index = 0; index < offsets.length; index += 1) {
    const light = offsets[index] ?? 0;

    offsets[index] =
      light === 0 ? ambient : toShadeOffset(ambientExposure + light);
  }

  return offsets;
};
