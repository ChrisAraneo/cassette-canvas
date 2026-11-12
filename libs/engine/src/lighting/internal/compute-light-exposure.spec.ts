import { chunk, includes, join, map, times, toArray } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import type { Light } from '../../screen/types/light';
import { REFERENCE_EXPOSURE } from '../consts';
import type { Lighting } from '../types/lighting';
import { computeLightExposure } from './compute-light-exposure';
import { toExposure } from './to-exposure';

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

const TORCH_EMISSION = toExposure(TORCH.intensity) - REFERENCE_EXPOSURE;

const WIDE_SUN: Light = Object.freeze({ ...SUN, row: 3 });

/** A wall 3 pixels tall, at column 3 of a 9 by 7 screen. */
const WALL: readonly number[] = Object.freeze([
  2 * 9 + 3,
  3 * 9 + 3,
  4 * 9 + 3,
]);

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

const formatLit = (exposures: Float32Array, width: number): string[] =>
  map(chunk(toArray(exposures), width), (row) =>
    join(
      map(row, (exposure) =>
        match(exposure > 0)
          .with(true, () => '#')
          .otherwise(() => '.'),
      ),
      '',
    ),
  );

describe('computeLightExposure', () => {
  it('should put its whole light at its center', () => {
    expect(
      computeLightExposure(createLighting(5, 1, []), TORCH)[0],
    ).toBeCloseTo(TORCH_EMISSION);
  });

  it('should thin the light out with every step away from its center', () => {
    const exposures = toArray(
      computeLightExposure(createLighting(5, 1, []), { ...TORCH, radius: 4 }),
    );

    expect(exposures).toEqual([
      TORCH_EMISSION,
      0.661468505859375,
      0.29296875,
      0.08496370911598206,
      0,
    ]);
  });

  it('should keep more than half its light in the core and less than half past halfway', () => {
    const exposures = computeLightExposure(createLighting(5, 1, []), {
      ...TORCH,
      radius: 4,
    });

    expect(exposures[1] ?? 0).toBeGreaterThan(TORCH_EMISSION / 2);
    expect(exposures[2] ?? 0).toBeLessThan(TORCH_EMISSION / 2);
  });

  it('should leave the places beyond its reach dark', () => {
    expect(
      toArray(
        computeLightExposure(createLighting(5, 1, []), { ...TORCH, radius: 1 }),
      ),
    ).toEqual([TORCH_EMISSION, 0, 0, 0, 0]);
  });

  it('should give no light behind a shadow caster', () => {
    expect(
      formatLit(
        computeLightExposure(createLighting(5, 1, [1]), {
          ...TORCH,
          radius: 4,
        }),
        5,
      ),
    ).toEqual(['##...']);
  });

  it('should light the side of a shadow caster that faces the light', () => {
    expect(
      computeLightExposure(createLighting(5, 1, [2]), {
        ...TORCH,
        radius: 4,
      })[2],
    ).toBeGreaterThan(0);
  });

  it('should let the light out when the light sits inside a shadow caster', () => {
    expect(
      computeLightExposure(createLighting(5, 1, [0]), {
        ...TORCH,
        radius: 4,
      })[1],
    ).toBeGreaterThan(0);
  });

  it('should keep the heart of a shadow dark', () => {
    expect(
      computeLightExposure(createLighting(9, 7, WALL), WIDE_SUN)[3 * 9 + 6],
    ).toBe(0);
  });

  it('should ramp from light into shadow across the edge rather than step down', () => {
    const exposures = computeLightExposure(
      createLighting(9, 7, WALL),
      WIDE_SUN,
    );
    const open = exposures[6 * 9 + 6] ?? 0;
    const edge = exposures[5 * 9 + 6] ?? 0;
    const deeper = exposures[4 * 9 + 6] ?? 0;

    expect(edge).toBeLessThan(open);
    expect(deeper).toBeLessThan(edge);
    expect(deeper).toBeGreaterThan(0);
  });

  it('should keep the penumbra the same width however long the shadow runs', () => {
    const exposures = computeLightExposure(
      createLighting(9, 7, WALL),
      WIDE_SUN,
    );

    const near = exposures[4 * 9 + 5] ?? 0;
    const far = exposures[4 * 9 + 8] ?? 0;

    expect(near).toBeGreaterThan(0);
    expect(far).toBeCloseTo(near, 2);
  });

  it('should throw a wedge of shadow behind a wall when the light shines across the screen', () => {
    const exposures = computeLightExposure(
      createLighting(7, 3, [3, 10, 17]),
      SUN,
    );

    expect(formatLit(exposures, 7)).toEqual(['####...', '####...', '####...']);
  });

  it('should light the screen when the light stands off the screen', () => {
    const exposures = computeLightExposure(createLighting(4, 2, []), {
      ...SUN,
      row: -500,
      column: 2,
    });

    expect(formatLit(exposures, 4)).toEqual(['####', '####']);
  });

  it('should take light away instead when the light has a negative intensity', () => {
    expect(
      computeLightExposure(createLighting(5, 1, []), {
        ...TORCH,
        intensity: -4,
      })[0],
    ).toBeCloseTo(toExposure(-4) - REFERENCE_EXPOSURE);
  });

  it('should give no light when the light has no reach', () => {
    expect(
      toArray(
        computeLightExposure(createLighting(3, 1, []), { ...TORCH, radius: 0 }),
      ),
    ).toEqual([0, 0, 0]);
  });

  it('should give no light when the light has no intensity', () => {
    expect(
      toArray(
        computeLightExposure(createLighting(3, 1, []), {
          ...TORCH,
          intensity: 0,
        }),
      ),
    ).toEqual([0, 0, 0]);
  });

  it('should give an empty field when the screen has no places', () => {
    expect(computeLightExposure(createLighting(0, 0, []), TORCH)).toHaveLength(
      0,
    );
  });
});
