import { describe, expect, it } from 'vitest';

import type { Light } from '../screen/types/light';
import { computeLightLevels } from './compute-light-levels';
import type { Lighting } from './types/lighting';

const TORCH: Light = Object.freeze({
  id: 'torch',
  row: 0,
  column: 0,
  radius: 4,
  intensity: 4,
});

const LANTERN: Light = Object.freeze({
  id: 'lantern',
  row: 0,
  column: 4,
  radius: 4,
  intensity: 2,
});

const createLighting = (
  ambient: number,
  lights: readonly Light[],
): Lighting => ({
  ambient,
  lights,
  width: 5,
  height: 1,
  occluders: new Uint8Array(5),
});

describe('computeLightLevels', () => {
  it('should give every place the ambient light when there are no lights', () => {
    expect(computeLightLevels(createLighting(-3, []))).toEqual(
      Float64Array.from([-3, -3, -3, -3, -3]),
    );
  });

  it('should add the light to the ambient light when one light shines', () => {
    expect(computeLightLevels(createLighting(-3, [TORCH]))).toEqual(
      Float64Array.from([1, 0, -1, -2, -3]),
    );
  });

  it('should add the lights together when they overlap', () => {
    expect(computeLightLevels(createLighting(0, [TORCH, LANTERN]))).toEqual(
      Float64Array.from([4, 3.5, 3, 2.5, 2]),
    );
  });

  it('should give no levels when the screen has no places', () => {
    expect(
      computeLightLevels({
        ...createLighting(0, [TORCH]),
        width: 0,
        height: 0,
      }),
    ).toHaveLength(0);
  });
});
