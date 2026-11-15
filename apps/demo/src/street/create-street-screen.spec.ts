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
import { DAY_SKY, NIGHT_DEPTH, SUN_ID } from './consts';
import { createStreetScenery } from './create-street-scenery';
import { createStreetScreen } from './create-street-screen';

const SCENERY = createStreetScenery();

const NIGHT = DAY_LENGTH / 2;

const findPrefixIndex = (
  sprites: readonly SpritePlacement[],
  prefix: string,
): number => findIndex(sprites, ({ id }) => startsWith(id, prefix));

describe('createStreetScreen', () => {
  it('should return the day sky as the background when it composes the street', () => {
    expect(createStreetScreen(SCENERY, 0).background).toBe(DAY_SKY);
  });

  it('should return no ambient light when it is morning', () => {
    expect(createStreetScreen(SCENERY, 0).ambient).toBeCloseTo(0);
  });

  it('should return only the glow of the sun as a light when it is morning', () => {
    expect(createStreetScreen(SCENERY, 0).lights).toEqual([
      expect.objectContaining({ id: SUN_ID }),
    ]);
  });

  it('should return the ambient light of the night when it is night', () => {
    expect(createStreetScreen(SCENERY, NIGHT).ambient).toBe(-NIGHT_DEPTH);
  });

  it('should return the window, lamp, and headlight lights when it is night', () => {
    const screen = createStreetScreen(SCENERY, NIGHT);

    expect([
      some(screen.sprites, ({ id }) => startsWith(id, 'townhouse-glow-')),
      some(screen.sprites, ({ id }) => startsWith(id, 'lamp-glass-')),
      some(screen.lights, ({ id }) => startsWith(id, 'lamp-')),
    ]).toEqual([true, true, true]);
  });

  it('should return the lit skyline sprites when it is night', () => {
    expect(createStreetScreen(SCENERY, NIGHT).sprites).toEqual(
      expect.arrayContaining([...SCENERY.nightSkyline]),
    );
  });

  it('should return the sky before the buildings and the buildings before the people when it composes the screen', () => {
    const sprites = createStreetScreen(SCENERY, 0).sprites;

    expect(findPrefixIndex(sprites, SUN_ID)).toBeLessThan(
      findPrefixIndex(sprites, 'townhouse-'),
    );
    expect(findPrefixIndex(sprites, 'townhouse-')).toBeLessThan(
      findPrefixIndex(sprites, 'person-'),
    );
  });

  it('should return the car sprites after the road when it composes the street', () => {
    const sprites = createStreetScreen(SCENERY, 0).sprites;

    expect(
      findLastIndex(sprites, ({ id }) => startsWith(id, 'road-')),
    ).toBeLessThan(findPrefixIndex(sprites, 'car-'));
    expect(startsWith(last(sprites)?.id, 'car-')).toBe(true);
  });

  it('should return extra sprites only for what changes when it is night', () => {
    expect(
      size(createStreetScreen(SCENERY, NIGHT).sprites) -
        size(createStreetScreen(SCENERY, 0).sprites),
    ).toBeGreaterThan(0);
  });

  it('should not change the scenery when it composes the street', () => {
    createStreetScreen(SCENERY, NIGHT);

    expect(SCENERY).toEqual(createStreetScenery());
  });
});
