import { size, toArray } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Light } from '../../screen/types/light';
import type { Lighting } from '../types/lighting';
import { computeLightExposure } from './compute-light-exposure';
import { computeLightExposures } from './compute-light-exposures';

const TORCH: Light = Object.freeze({
  id: 'torch',
  row: 0,
  column: 0,
  radius: 2,
  intensity: 4,
});

const LANTERN: Light = Object.freeze({
  id: 'lantern',
  row: 1,
  column: 1,
  radius: 3,
  intensity: 2,
});

const createLighting = (lights: readonly Light[]): Lighting => ({
  ambient: 0,
  lights,
  width: 2,
  height: 2,
  occluders: new Uint8Array(4),
});

describe('computeLightExposures', () => {
  it('should return one field for every light of the scene when it computes them', () => {
    expect(size(computeLightExposures(createLighting([TORCH, LANTERN])))).toBe(
      2,
    );
  });

  it('should return no fields at all when the scene holds no lights', () => {
    expect(computeLightExposures(createLighting([]))).toEqual([]);
  });

  it('should return the field of one light when the scene holds only it', () => {
    const lighting = createLighting([TORCH]);

    expect(toArray(computeLightExposures(lighting)[0] ?? [])).toEqual(
      toArray(computeLightExposure(lighting, TORCH)),
    );
  });

  it('should return the fields in the order the scene holds its lights', () => {
    const lighting = createLighting([TORCH, LANTERN]);

    expect(toArray(computeLightExposures(lighting)[1] ?? [])).toEqual(
      toArray(computeLightExposure(lighting, LANTERN)),
    );
  });

  it('should return a field of a place for every pixel of the scene when it computes one', () => {
    expect(size(computeLightExposures(createLighting([TORCH]))[0] ?? [])).toBe(
      4,
    );
  });

  it('should leave the scene it was given unchanged when it computes the fields', () => {
    const lighting = createLighting([TORCH]);

    computeLightExposures(lighting);

    expect(lighting.lights).toEqual([TORCH]);
  });
});
