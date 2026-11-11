import { describe, expect, it } from 'vitest';

import type { Lighting } from '../types/lighting';
import { computeFieldLevels } from './compute-field-levels';

const LARGEST_EXACT_WHOLE_NUMBER = 2 ** 53;

const createLighting = (ambient: number, width: number): Lighting => ({
  ambient,
  lights: [],
  width,
  height: 1,
  occluders: new Uint8Array(width),
});

describe('computeFieldLevels', () => {
  it('should give every place the ambient light when there are no fields', () => {
    expect(computeFieldLevels(createLighting(-3, 3), [])).toEqual(
      Float64Array.from([-3, -3, -3]),
    );
  });

  it('should add every field to the ambient light when the fields overlap', () => {
    expect(
      computeFieldLevels(createLighting(-1, 3), [
        Float32Array.from([4, 2, 0]),
        Float32Array.from([0, 1, 0.5]),
      ]),
    ).toEqual(Float64Array.from([3, 2, -0.5]));
  });

  it('should add the fields together before it adds the ambient light', () => {
    expect(
      computeFieldLevels(createLighting(LARGEST_EXACT_WHOLE_NUMBER, 1), [
        Float32Array.from([1]),
        Float32Array.from([1]),
      ])[0],
    ).toBe(LARGEST_EXACT_WHOLE_NUMBER + 2);
  });

  it('should give no levels when the screen has no places', () => {
    expect(computeFieldLevels(createLighting(2, 0), [])).toHaveLength(0);
  });

  it('should not change the fields when it adds them up', () => {
    const field = Float32Array.from([4, 2]);

    computeFieldLevels(createLighting(-1, 2), [field]);

    expect(field).toEqual(Float32Array.from([4, 2]));
  });
});
