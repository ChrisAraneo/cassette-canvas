import { find, findIndex, floor, inRange, join, times } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { computeHash } from '../../math/compute-hash';
import {
  SCREEN_WIDTH,
  SKYLINE_HEIGHT,
  SKYLINE_LIT_SHARE,
  SKYLINE_ROW,
} from '../consts';
import type { Tower } from '../types/tower';

const { nonNullable } = P;

/** Windows sit on floors 4 pixels tall and in bays 3 pixels wide. */
const FLOOR_HEIGHT = 4;

const BAY_WIDTH = 3;

/** The roof is this many pixels tall, with no windows. */
const ROOF_HEIGHT = 3;

const SKY = '.';

const WALL = 'z';

const DARK_WINDOW = 'w';

const LIT_WINDOW = 'l';

/** Spreads the window hashes so neighbors do not light up together. */
const FLOOR_SEED = 31;

const TOWER_SEED = 101;

const isWindow = (depth: number, inset: number, width: number): boolean =>
  depth >= ROOF_HEIGHT &&
  depth % FLOOR_HEIGHT !== 0 &&
  depth % FLOOR_HEIGHT !== FLOOR_HEIGHT - 1 &&
  inset > 0 &&
  inset < width - 1 &&
  inset % BAY_WIDTH === 1;

const toWindowSymbol = (
  towerIndex: number,
  depth: number,
  inset: number,
): string =>
  match(
    computeHash(
      towerIndex * TOWER_SEED +
        floor(depth / FLOOR_HEIGHT) * FLOOR_SEED +
        floor(inset / BAY_WIDTH),
    ) < SKYLINE_LIT_SHARE,
  )
    .with(true, () => LIT_WINDOW)
    .otherwise(() => DARK_WINDOW);

const toTowerSymbol = (
  towers: readonly Tower[],
  tower: Tower,
  row: number,
  column: number,
): string =>
  match({ depth: row - tower.top, inset: column - tower.column })
    .when(
      ({ depth }) => depth < 0,
      () => SKY,
    )
    .when(
      ({ depth, inset }) => isWindow(depth, inset, tower.width),
      ({ depth, inset }) =>
        toWindowSymbol(findIndex(towers, tower), depth, inset),
    )
    .otherwise(() => WALL);

const toSymbol = (
  towers: readonly Tower[],
  row: number,
  column: number,
): string =>
  match(
    find(towers, (tower) =>
      inRange(column, tower.column, tower.column + tower.width),
    ),
  )
    .with(nonNullable, (tower) => toTowerSymbol(towers, tower, row, column))
    .otherwise(() => SKY);

/**
 * Draws the distant skyline as text art, `SKYLINE_HEIGHT` rows from
 * `SKYLINE_ROW` down, across the whole screen. `z` is a wall, and `w` and
 * `l` are windows. The `l` windows are the ones that light up at night.
 */
export const createSkylineArt = (towers: readonly Tower[]): string[] =>
  times(SKYLINE_HEIGHT, (index) =>
    join(
      times(SCREEN_WIDTH, (column) =>
        toSymbol(towers, SKYLINE_ROW + index, column),
      ),
      '',
    ),
  );
