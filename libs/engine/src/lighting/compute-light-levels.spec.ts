import { map, range, size, toArray } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { EXTENDED_SHADES_PER_SHADE } from '../palette/consts';
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
  intensity: 4,
});

const DAYLIGHT = 0;

const BRIGHT_AMBIENT = 8;

const SINGLE_TORCH = 1;

const TORCH_STACK = 8;

const TORCH_STACK_DOUBLINGS = 3;

const NIGHT_LIGHT_RATIO = 4;

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

const computeLevels = (ambient: number, lights: readonly Light[]): number[] =>
  toArray(computeLightLevels(createLighting(ambient, lights)));

const getCenterLevel = (ambient: number, lights: readonly Light[]): number =>
  computeLevels(ambient, lights)[0] ?? 0;

const createTorchStack = (count: number): Light[] =>
  map(range(count), (index) => ({ ...TORCH, id: `torch-${index}` }));

describe('computeLightLevels', () => {
  it('should return the ambient light for every place when there are no lights', () => {
    expect(computeLevels(-3, [])).toEqual([-3, -3, -3, -3, -3]);
  });

  it('should return the whole intensity when the place is the center of one light', () => {
    expect(getCenterLevel(DAYLIGHT, [TORCH])).toBe(TORCH.intensity);
  });

  it('should return the ambient light when the place is at the radius of the light', () => {
    expect(computeLevels(-3, [TORCH])[4]).toBe(-3);
  });

  it('should return less light when the place is a step further from the center', () => {
    const levels = computeLevels(-3, [TORCH]);

    expect(levels[1] ?? 0).toBeLessThan(levels[0] ?? 0);
    expect(levels[2] ?? 0).toBeLessThan(levels[1] ?? 0);
    expect(levels[3] ?? 0).toBeLessThan(levels[2] ?? 0);
  });

  it('should return the added light, not the added shades, when two lights overlap', () => {
    const one = computeLevels(DAYLIGHT, [TORCH])[2] ?? 0;
    const both = computeLevels(DAYLIGHT, [TORCH, LANTERN])[2] ?? 0;

    expect(both).toBeGreaterThan(one);
    expect(both).toBeLessThan(2 * one);
  });

  it('should return no more than one stop of shades when the lights double', () => {
    expect(
      getCenterLevel(BRIGHT_AMBIENT, createTorchStack(TORCH_STACK)),
    ).toBeLessThanOrEqual(
      getCenterLevel(BRIGHT_AMBIENT, createTorchStack(SINGLE_TORCH)) +
        TORCH_STACK_DOUBLINGS * EXTENDED_SHADES_PER_SHADE,
    );
  });

  it('should return far less light when the scene is daylight than when it is dark', () => {
    const dim: Light = { ...TORCH, intensity: 1 };

    expect(getCenterLevel(NIGHT, [dim]) - NIGHT).toBeGreaterThan(
      NIGHT_LIGHT_RATIO * (getCenterLevel(DAYLIGHT, [dim]) - DAYLIGHT),
    );
  });

  it('should return no levels when the screen has no places', () => {
    expect(
      size(
        computeLightLevels({
          ...createLighting(DAYLIGHT, [TORCH]),
          width: 0,
          height: 0,
        }),
      ),
    ).toBe(0);
  });

  it('should not change the lighting it was given when it computes the levels', () => {
    const lighting = createLighting(DAYLIGHT, [TORCH]);

    computeLightLevels(lighting);

    expect(lighting).toEqual(createLighting(DAYLIGHT, [TORCH]));
  });
});
