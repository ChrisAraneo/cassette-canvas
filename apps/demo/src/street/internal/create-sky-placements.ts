import type { SpritePlacement } from '@cassette-canvas/engine';
import { flatMap, floor, map } from 'lodash-es';
import { match } from 'ts-pattern';
import { MOON, STAR_FRAMES, SUN } from '../../art/sky/consts';
import type { DayCycle } from '../../day/types/day-cycle';
import { toTilePlacements } from '../../tiles/to-tile-placements';
import type { Tile } from '../../tiles/types/tile';
import {
  CLOUDS,
  HALF_DAY,
  MOON_ID,
  ORB_RADIUS,
  ORB_SET_HEIGHT,
  STARS,
  STARS_OUT,
  SUN_ID,
} from '../consts';
import type { Star } from '../types/star';
import { computeOrb } from './compute-orb';
import { createMoverPlacements } from './create-mover-placements';
import type { Orb } from './types/orb';

const TWINKLE_CYCLE = 4;

const createOrbPlacements = (
  id: string,
  tiles: readonly Tile[],
  { row, column, height }: Orb,
): SpritePlacement[] =>
  match(height > ORB_SET_HEIGHT)
    .with(true, () =>
      toTilePlacements(tiles, {
        id,
        row: row - ORB_RADIUS,
        column: column - ORB_RADIUS,
        castsShadow: false,
      }),
    )
    .otherwise(() => []);

const createStarPlacement = (
  { id, row, column, period }: Star,
  time: number,
): SpritePlacement => ({
  id,
  sprite:
    STAR_FRAMES[
      match(floor(time / period) % TWINKLE_CYCLE)
        .with(0, () => 1)
        .otherwise(() => 0)
    ] ?? [],
  row,
  column,
  castsShadow: false,
});

const createStarPlacements = (
  darkness: number,
  time: number,
): SpritePlacement[] =>
  match(darkness >= STARS_OUT)
    .with(true, () => map(STARS, (star) => createStarPlacement(star, time)))
    .otherwise(() => []);

/**
 * Places what is in the sky at `time`: the stars (only at night), the sun,
 * the moon, and the clouds, back to front.
 */
export const createSkyPlacements = (
  { phase, darkness }: DayCycle,
  time: number,
): SpritePlacement[] => [
  ...createStarPlacements(darkness, time),
  ...createOrbPlacements(SUN_ID, SUN, computeOrb(phase)),
  ...createOrbPlacements(MOON_ID, MOON, computeOrb(phase + HALF_DAY)),
  ...flatMap(CLOUDS, (cloud) => createMoverPlacements(cloud, time)),
];
