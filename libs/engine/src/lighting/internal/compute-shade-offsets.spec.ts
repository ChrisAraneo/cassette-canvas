import { describe, expect, it } from 'vitest';

import {
  EXTENDED_SHADES_PER_STOP,
  MIN_SHADE_OFFSET,
  REFERENCE_EXPOSURE,
} from '../consts';
import type { Lighting } from '../types/lighting';
import { computeShadeOffsets } from './compute-shade-offsets';

const createLighting = (ambient: number, width: number): Lighting => ({
  ambient,
  lights: [],
  width,
  height: 1,
  occluders: new Uint8Array(width),
});

const offsetAt = (
  ambient: number,
  exposures: readonly number[],
): number | undefined =>
  computeShadeOffsets(createLighting(ambient, 1), [
    Float32Array.from(exposures),
  ])[0];

describe('computeShadeOffsets', () => {
  it('should give every place the ambient light when no light reaches it', () => {
    expect(computeShadeOffsets(createLighting(-3, 3), [])).toEqual(
      Float64Array.from([-3, -3, -3]),
    );
  });

  it('should give a light its whole intensity when it shines on an unlit scene', () => {
    expect(offsetAt(0, [REFERENCE_EXPOSURE])).toBe(EXTENDED_SHADES_PER_STOP);
  });

  it('should spend one stop of shades on every doubling of the light', () => {
    expect(offsetAt(0, [REFERENCE_EXPOSURE])).toBe(EXTENDED_SHADES_PER_STOP);
    expect(offsetAt(0, [3 * REFERENCE_EXPOSURE])).toBe(
      2 * EXTENDED_SHADES_PER_STOP,
    );
    expect(offsetAt(0, [7 * REFERENCE_EXPOSURE])).toBe(
      3 * EXTENDED_SHADES_PER_STOP,
    );
  });

  it('should add the light of two lights that overlap, not their shades', () => {
    const one = offsetAt(0, [REFERENCE_EXPOSURE]) ?? 0;
    const both =
      computeShadeOffsets(createLighting(0, 1), [
        Float32Array.from([REFERENCE_EXPOSURE]),
        Float32Array.from([REFERENCE_EXPOSURE]),
      ])[0] ?? 0;

    expect(both).toBeGreaterThan(one);
    expect(both).toBeLessThan(2 * one);
  });

  it('should barely lift a place that daylight already lights', () => {
    const lamp = 0.1 * REFERENCE_EXPOSURE;

    expect(offsetAt(0, [lamp]) ?? 0).toBeLessThan(1);
    expect(offsetAt(-16, [lamp]) ?? 0).toBeGreaterThan(-16 + 1);
  });

  it('should take light away when a light has a negative intensity', () => {
    expect(offsetAt(0, [-REFERENCE_EXPOSURE / 2])).toBe(
      -EXTENDED_SHADES_PER_STOP,
    );
  });

  it('should go no darker than the darkest offset when a light takes all the light away', () => {
    expect(offsetAt(0, [-2 * REFERENCE_EXPOSURE])).toBe(MIN_SHADE_OFFSET);
  });

  it('should give no offsets when the screen has no places', () => {
    expect(computeShadeOffsets(createLighting(2, 0), [])).toHaveLength(0);
  });

  it('should not change the light it adds up', () => {
    const exposures = Float32Array.from([4, 2]);

    computeShadeOffsets(createLighting(-1, 2), [exposures]);

    expect(exposures).toEqual(Float32Array.from([4, 2]));
  });
});
