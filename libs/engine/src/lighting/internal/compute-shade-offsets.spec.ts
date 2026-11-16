import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { EXTENDED_SHADES_PER_SHADE } from '../../palette/consts';
import { MIN_SHADE_OFFSET, REFERENCE_EXPOSURE } from '../consts';
import type { Lighting } from '../types/lighting';
import { computeShadeOffsets } from './compute-shade-offsets';

const NIGHT = -16;

const BARELY_LIT = 1;

const DIM_LAMP_EXPOSURE = 0.1 * REFERENCE_EXPOSURE;

const createLighting = (ambient: number, width: number): Lighting => ({
  ambient,
  lights: [],
  width,
  height: 1,
  occluders: new Uint8Array(width),
});

const createExposures = (): Float32Array => Float32Array.from([4, 2]);

const computeOffsetAt = (
  ambient: number,
  exposures: readonly number[],
): number | undefined =>
  computeShadeOffsets(createLighting(ambient, 1), [
    Float32Array.from(exposures),
  ])[0];

describe('computeShadeOffsets', () => {
  it('should return the ambient light for every place when no light reaches it', () => {
    expect(computeShadeOffsets(createLighting(-3, 3), [])).toEqual(
      Float64Array.from([-3, -3, -3]),
    );
  });

  it('should return the whole intensity of a light when it shines on an unlit scene', () => {
    expect(computeOffsetAt(0, [REFERENCE_EXPOSURE])).toBe(
      EXTENDED_SHADES_PER_SHADE,
    );
  });

  it('should return one stop of shades when the light doubles', () => {
    expect(computeOffsetAt(0, [REFERENCE_EXPOSURE])).toBe(
      EXTENDED_SHADES_PER_SHADE,
    );
    expect(computeOffsetAt(0, [3 * REFERENCE_EXPOSURE])).toBe(
      2 * EXTENDED_SHADES_PER_SHADE,
    );
    expect(computeOffsetAt(0, [7 * REFERENCE_EXPOSURE])).toBe(
      3 * EXTENDED_SHADES_PER_SHADE,
    );
  });

  it('should return the added light, not the added shades, when two lights overlap', () => {
    const one = computeOffsetAt(0, [REFERENCE_EXPOSURE]) ?? 0;
    const both =
      computeShadeOffsets(createLighting(0, 1), [
        Float32Array.from([REFERENCE_EXPOSURE]),
        Float32Array.from([REFERENCE_EXPOSURE]),
      ])[0] ?? 0;

    expect(both).toBeGreaterThan(one);
    expect(both).toBeLessThan(2 * one);
  });

  it('should return barely any lift when daylight already lights the place', () => {
    expect(computeOffsetAt(0, [DIM_LAMP_EXPOSURE]) ?? 0).toBeLessThan(
      BARELY_LIT,
    );
    expect(computeOffsetAt(NIGHT, [DIM_LAMP_EXPOSURE]) ?? 0).toBeGreaterThan(
      NIGHT + BARELY_LIT,
    );
  });

  it('should return less light when a light has a negative intensity', () => {
    expect(computeOffsetAt(0, [-REFERENCE_EXPOSURE / 2])).toBe(
      -EXTENDED_SHADES_PER_SHADE,
    );
  });

  it('should return the darkest offset when a light takes all the light away', () => {
    expect(computeOffsetAt(0, [-2 * REFERENCE_EXPOSURE])).toBe(
      MIN_SHADE_OFFSET,
    );
  });

  it('should return no offsets when the screen has no places', () => {
    expect(size(computeShadeOffsets(createLighting(2, 0), []))).toBe(0);
  });

  it('should not change the exposures it adds up when it computes the offsets', () => {
    const exposures = createExposures();

    computeShadeOffsets(createLighting(-1, 2), [exposures]);

    expect(exposures).toEqual(createExposures());
  });
});
