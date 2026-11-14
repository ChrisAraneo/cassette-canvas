import { map, range, toArray } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Light } from '../screen/types/light';
import { computeLightLevels } from './compute-light-levels';
import { EXTENDED_SHADES_PER_STOP } from './consts';
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
  intensity: 4,
});

const DAYLIGHT = 0;

const NIGHT = -16;

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

const levelsOf = (ambient: number, lights: readonly Light[]): number[] =>
  toArray(computeLightLevels(createLighting(ambient, lights)));

const centerOf = (ambient: number, lights: readonly Light[]): number =>
  levelsOf(ambient, lights)[0] ?? 0;

const stackOf = (count: number): Light[] =>
  map(range(count), (index) => ({ ...TORCH, id: `torch-${index}` }));

describe('computeLightLevels', () => {
  it('should return the ambient light for every place when there are no lights', () => {
    expect(levelsOf(-3, [])).toEqual([-3, -3, -3, -3, -3]);
  });

  it('should return the whole intensity when the place is the center of one light', () => {
    expect(centerOf(DAYLIGHT, [TORCH])).toBe(TORCH.intensity);
  });

  it('should return the ambient light when the place is at the radius of the light', () => {
    expect(levelsOf(-3, [TORCH])[4]).toBe(-3);
  });

  it('should return less light when the place is a step further from the center', () => {
    const levels = levelsOf(-3, [TORCH]);

    expect(levels[1] ?? 0).toBeLessThan(levels[0] ?? 0);
    expect(levels[2] ?? 0).toBeLessThan(levels[1] ?? 0);
    expect(levels[3] ?? 0).toBeLessThan(levels[2] ?? 0);
  });

  it('should return the added light, not the added shades, when two lights overlap', () => {
    const one = levelsOf(DAYLIGHT, [TORCH])[2] ?? 0;
    const both = levelsOf(DAYLIGHT, [TORCH, LANTERN])[2] ?? 0;

    expect(both).toBeGreaterThan(one);
    expect(both).toBeLessThan(2 * one);
  });

  it('should return no more than one stop of shades when the lights double', () => {
    expect(centerOf(8, stackOf(8))).toBeLessThanOrEqual(
      centerOf(8, stackOf(1)) + 3 * EXTENDED_SHADES_PER_STOP,
    );
  });

  it('should return far less light when the scene is daylight than when it is dark', () => {
    const dim: Light = { ...TORCH, intensity: 1 };

    expect(centerOf(NIGHT, [dim]) - NIGHT).toBeGreaterThan(
      4 * (centerOf(DAYLIGHT, [dim]) - DAYLIGHT),
    );
  });

  it('should return no levels when the screen has no places', () => {
    expect(
      computeLightLevels({
        ...createLighting(DAYLIGHT, [TORCH]),
        width: 0,
        height: 0,
      }),
    ).toHaveLength(0);
  });
});
