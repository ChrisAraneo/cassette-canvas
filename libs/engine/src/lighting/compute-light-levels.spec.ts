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
  it('should give every place the ambient light when there are no lights', () => {
    expect(levelsOf(-3, [])).toEqual([-3, -3, -3, -3, -3]);
  });

  it('should move a pixel by the whole intensity at the center of one light', () => {
    expect(centerOf(DAYLIGHT, [TORCH])).toBe(TORCH.intensity);
  });

  it('should fade the light back to the ambient light at its radius', () => {
    expect(levelsOf(-3, [TORCH])[4]).toBe(-3);
  });

  it('should fade the light down with every step away from its center', () => {
    const levels = levelsOf(-3, [TORCH]);

    expect(levels[1] ?? 0).toBeLessThan(levels[0] ?? 0);
    expect(levels[2] ?? 0).toBeLessThan(levels[1] ?? 0);
    expect(levels[3] ?? 0).toBeLessThan(levels[2] ?? 0);
  });

  it('should add the light of two lights that overlap, not their shades', () => {
    const one = levelsOf(DAYLIGHT, [TORCH])[2] ?? 0;
    const both = levelsOf(DAYLIGHT, [TORCH, LANTERN])[2] ?? 0;

    expect(both).toBeGreaterThan(one);
    expect(both).toBeLessThan(2 * one);
  });

  it('should spend no more than one stop of shades on every doubling of the lights', () => {
    expect(centerOf(8, stackOf(8))).toBeLessThanOrEqual(
      centerOf(8, stackOf(1)) + 3 * EXTENDED_SHADES_PER_STOP,
    );
  });

  it('should show a light far less in daylight than in the dark', () => {
    const dim: Light = { ...TORCH, intensity: 1 };

    expect(centerOf(NIGHT, [dim]) - NIGHT).toBeGreaterThan(
      4 * (centerOf(DAYLIGHT, [dim]) - DAYLIGHT),
    );
  });

  it('should give no levels when the screen has no places', () => {
    expect(
      computeLightLevels({
        ...createLighting(DAYLIGHT, [TORCH]),
        width: 0,
        height: 0,
      }),
    ).toHaveLength(0);
  });
});
