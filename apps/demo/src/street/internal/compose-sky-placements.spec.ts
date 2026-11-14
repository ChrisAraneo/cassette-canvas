import { filter, find, size, some, startsWith } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { STAR_FRAMES } from '../../art/sky/consts';
import { MOON_ID, STARS, SUN_ID } from '../consts';
import { composeSkyPlacements } from './compose-sky-placements';

const NOON = Object.freeze({ phase: 0.5, darkness: 0 });

const MIDNIGHT = Object.freeze({ phase: 0, darkness: 1 });

const hasPrefix = (
  placements: readonly { readonly id: string }[],
  prefix: string,
): boolean => some(placements, ({ id }) => startsWith(id, prefix));

describe('composeSkyPlacements', () => {
  it('should return the sun and not the moon when it is noon', () => {
    const sky = composeSkyPlacements(NOON, 0);

    expect([hasPrefix(sky, SUN_ID), hasPrefix(sky, MOON_ID)]).toEqual([
      true,
      false,
    ]);
  });

  it('should return the moon and not the sun when it is midnight', () => {
    const sky = composeSkyPlacements(MIDNIGHT, 0);

    expect([hasPrefix(sky, SUN_ID), hasPrefix(sky, MOON_ID)]).toEqual([
      false,
      true,
    ]);
  });

  it('should return no stars when it is daylight', () => {
    expect(hasPrefix(composeSkyPlacements(NOON, 0), 'star-')).toBe(false);
  });

  it('should return every star when it is night', () => {
    expect(
      size(
        filter(composeSkyPlacements(MIDNIGHT, 0), ({ id }) =>
          startsWith(id, 'star-'),
        ),
      ),
    ).toBe(size(STARS));
  });

  it('should return the other frame of a star when its period has passed', () => {
    const star = STARS[0];
    const findStar = (time: number): unknown =>
      find(composeSkyPlacements(MIDNIGHT, time), ({ id }) => id === star?.id)
        ?.sprite;

    expect([findStar(0), findStar(star?.period ?? 0)]).toEqual([
      STAR_FRAMES[1],
      STAR_FRAMES[0],
    ]);
  });

  it('should return the clouds when it is day and when it is night', () => {
    expect([
      hasPrefix(composeSkyPlacements(NOON, 0), 'cloud-'),
      hasPrefix(composeSkyPlacements(MIDNIGHT, 0), 'cloud-'),
    ]).toEqual([true, true]);
  });

  it('should return the stars before the sun, the moon, and the clouds when it is midnight', () => {
    expect(startsWith(composeSkyPlacements(MIDNIGHT, 0)[0]?.id, 'star-')).toBe(
      true,
    );
  });
});
