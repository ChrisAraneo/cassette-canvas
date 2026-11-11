import { chunk, includes, join, map, times, toArray } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import type { Light } from '../../screen/types/light';
import type { Lighting } from '../types/lighting';
import { computeLightField } from './compute-light-field';

const TORCH: Light = Object.freeze({
  id: 'torch',
  row: 0,
  column: 0,
  radius: 2,
  intensity: 4,
});

const SUN: Light = Object.freeze({
  id: 'sun',
  row: 1,
  column: 0,
  radius: 1000,
  intensity: 4,
});

const createLighting = (
  width: number,
  height: number,
  casters: readonly number[],
): Lighting => ({
  ambient: 0,
  lights: [],
  width,
  height,
  occluders: Uint8Array.from(
    times(width * height, (place) =>
      match(includes(casters, place))
        .with(true, () => 1)
        .otherwise(() => 0),
    ),
  ),
});

const formatLit = (field: Float32Array, width: number): string[] =>
  map(chunk(toArray(field), width), (row) =>
    join(
      map(row, (level) =>
        match(level > 0)
          .with(true, () => '#')
          .otherwise(() => '.'),
      ),
      '',
    ),
  );

describe('computeLightField', () => {
  it('should fade the light in a straight line out to its reach', () => {
    expect(toArray(computeLightField(createLighting(5, 1, []), TORCH))).toEqual(
      [4, 2, 0, 0, 0],
    );
  });

  it('should leave the places beyond its reach dark', () => {
    expect(
      toArray(
        computeLightField(createLighting(5, 1, []), { ...TORCH, radius: 1 }),
      ),
    ).toEqual([4, 0, 0, 0, 0]);
  });

  it('should give no light behind a shadow caster', () => {
    expect(
      toArray(
        computeLightField(createLighting(5, 1, [1]), {
          ...TORCH,
          radius: 4,
        }),
      ),
    ).toEqual([4, 3, 0, 0, 0]);
  });

  it('should light the side of a shadow caster that faces the light', () => {
    expect(
      computeLightField(createLighting(5, 1, [2]), {
        ...TORCH,
        radius: 4,
      })[2],
    ).toBe(2);
  });

  it('should let the light out when the light sits inside a shadow caster', () => {
    expect(
      computeLightField(createLighting(5, 1, [0]), {
        ...TORCH,
        radius: 4,
      })[1],
    ).toBe(3);
  });

  it('should throw a wedge of shadow behind a wall when the light shines across the screen', () => {
    const field = computeLightField(createLighting(7, 3, [3, 10, 17]), SUN);

    expect(formatLit(field, 7)).toEqual(['####...', '####...', '####...']);
  });

  it('should light the screen when the light stands off the screen', () => {
    const field = computeLightField(createLighting(4, 2, []), {
      ...SUN,
      row: -500,
      column: 2,
    });

    expect(formatLit(field, 4)).toEqual(['####', '####']);
  });

  it('should darken instead when the light has a negative intensity', () => {
    expect(
      computeLightField(createLighting(5, 1, []), {
        ...TORCH,
        intensity: -4,
      })[1],
    ).toBe(-2);
  });

  it('should give no light when the light has no reach', () => {
    expect(
      toArray(
        computeLightField(createLighting(3, 1, []), { ...TORCH, radius: 0 }),
      ),
    ).toEqual([0, 0, 0]);
  });

  it('should give an empty field when the screen has no places', () => {
    expect(computeLightField(createLighting(0, 0, []), TORCH)).toHaveLength(0);
  });
});
