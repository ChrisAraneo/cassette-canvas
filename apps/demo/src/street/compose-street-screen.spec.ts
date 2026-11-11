import type { SpritePlacement } from '@cassette-canvas/engine';
import {
  findIndex,
  findLastIndex,
  last,
  size,
  some,
  startsWith,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { DAY_LENGTH } from '../day/consts';
import { composeStreetScreen } from './compose-street-screen';
import { DAY_SKY, NIGHT_DEPTH, SUN_ID } from './consts';
import { createStreetScenery } from './create-street-scenery';

const SCENERY = createStreetScenery();

/** The animation starts at 9:00, so half a day later it is 21:00. */
const NIGHT = DAY_LENGTH / 2;

const indexOfPrefix = (
  sprites: readonly SpritePlacement[],
  prefix: string,
): number => findIndex(sprites, ({ id }) => startsWith(id, prefix));

describe('composeStreetScreen', () => {
  it('should paint the day sky behind everything when it composes the street', () => {
    expect(composeStreetScreen(SCENERY, 0).background).toBe(DAY_SKY);
  });

  it('should keep the authored colors when it is morning', () => {
    expect(composeStreetScreen(SCENERY, 0).ambient).toBeCloseTo(0);
  });

  it('should only light the glow of the sun when it is morning', () => {
    expect(composeStreetScreen(SCENERY, 0).lights).toEqual([
      expect.objectContaining({ id: SUN_ID }),
    ]);
  });

  it('should darken everything when it is night', () => {
    expect(composeStreetScreen(SCENERY, NIGHT).ambient).toBe(-NIGHT_DEPTH);
  });

  it('should light the windows, the lamps and the headlights when it is night', () => {
    const screen = composeStreetScreen(SCENERY, NIGHT);

    expect([
      some(screen.sprites, ({ id }) => startsWith(id, 'townhouse-glow-')),
      some(screen.sprites, ({ id }) => startsWith(id, 'lamp-glass-')),
      some(screen.lights, ({ id }) => startsWith(id, 'lamp-')),
    ]).toEqual([true, true, true]);
  });

  it('should show the lit skyline when it is night', () => {
    expect(composeStreetScreen(SCENERY, NIGHT).sprites).toEqual(
      expect.arrayContaining([...SCENERY.nightSkyline]),
    );
  });

  it('should draw the sky behind the buildings and the buildings behind the people', () => {
    const sprites = composeStreetScreen(SCENERY, 0).sprites;

    expect(indexOfPrefix(sprites, SUN_ID)).toBeLessThan(
      indexOfPrefix(sprites, 'townhouse-'),
    );
    expect(indexOfPrefix(sprites, 'townhouse-')).toBeLessThan(
      indexOfPrefix(sprites, 'person-'),
    );
  });

  it('should draw the cars over the road when it composes the street', () => {
    const sprites = composeStreetScreen(SCENERY, 0).sprites;

    expect(
      findLastIndex(sprites, ({ id }) => startsWith(id, 'road-')),
    ).toBeLessThan(indexOfPrefix(sprites, 'car-'));
    expect(startsWith(last(sprites)?.id, 'car-')).toBe(true);
  });

  it('should add sprites only for what changes at night', () => {
    expect(
      size(composeStreetScreen(SCENERY, NIGHT).sprites) -
        size(composeStreetScreen(SCENERY, 0).sprites),
    ).toBeGreaterThan(0);
  });

  it('should not change the scenery when it composes the street', () => {
    composeStreetScreen(SCENERY, NIGHT);

    expect(SCENERY).toEqual(createStreetScenery());
  });
});
