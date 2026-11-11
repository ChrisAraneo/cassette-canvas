/* eslint-disable no-restricted-syntax -- Appendix B exception 1, measured below */
import type { Lighting } from '../types/lighting';

// Style guide - Appendix B exception 1 (hot numeric kernel).
// As a pipeline (times, with a sumBy over the fields for every place), adding
// up two light fields and the ambient light on the demo screen (320x180) took
// 1.7 ms per frame (Vite bundle, Node 24). This loop takes 0.24 ms. It adds
// the fields first and the ambient light last, in the same order as sumBy, so
// every level comes out the same. It only changes the typed array it creates
// itself, and the array does not change after it returns it.
export const computeFieldLevels = (
  { ambient, width, height }: Lighting,
  fields: readonly Float32Array[],
): Float64Array => {
  const levels = new Float64Array(Math.max(0, width * height));

  for (const field of fields) {
    for (let index = 0; index < levels.length; index += 1) {
      levels[index] = (levels[index] ?? 0) + (field[index] ?? 0);
    }
  }

  for (let index = 0; index < levels.length; index += 1) {
    levels[index] = ambient + (levels[index] ?? 0);
  }

  return levels;
};
