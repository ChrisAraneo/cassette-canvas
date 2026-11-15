import { filter, flatMap, includes, map } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { LIT_SHOP, TV_WINDOW, WARM_WINDOW } from '../../art/city/consts';
import { SPRITE_SIZE } from '../../consts';
import { hashSeed } from '../../math/hash-seed';
import { toTilePlacements } from '../../tiles/to-tile-placements';
import type { Tile } from '../../tiles/types/tile';
import { SHOP_HOURS, TV_SHARE, WINDOW_BEDTIME, WINDOW_DUSK } from '../consts';
import type { Building } from '../types/building';
import type { LitWindow } from '../types/lit-window';
import { computeBuildingTop } from './compute-building-top';
import { toGridCells } from './to-grid-cells';
import type { WindowSpot } from './types/window-spot';

const HOME_WINDOW = 'W';

const SHOP_WINDOW = 'S';

const WINDOW_CODES: readonly string[] = Object.freeze([
  HOME_WINDOW,
  SHOP_WINDOW,
]);

const DUSK_SEED = 1;

const BEDTIME_SEED = 0.5;

const findWindowSpots = (building: Building): WindowSpot[] =>
  pipe(
    toGridCells(building.grid),
    (cells) => filter(cells, ({ code }) => includes(WINDOW_CODES, code)),
    (cells) => map(cells, (cell) => ({ building, cell })),
  );

const createGlowPlacements = (
  tiles: readonly Tile[],
  { building, cell }: WindowSpot,
): LitWindow['placements'] =>
  toTilePlacements(tiles, {
    id: `${building.id}-glow-${cell.row}-${cell.column}`,
    row: computeBuildingTop(building) + cell.row * SPRITE_SIZE,
    column: building.column + cell.column * SPRITE_SIZE,
    castsShadow: false,
  });

const getHomeWindowArt = (index: number): readonly Tile[] =>
  match(hashSeed(index) < TV_SHARE)
    .with(true, () => TV_WINDOW)
    .otherwise(() => WARM_WINDOW);

const computeWindowDusk = (index: number): number =>
  WINDOW_DUSK.from +
  hashSeed(index + DUSK_SEED) * (WINDOW_DUSK.to - WINDOW_DUSK.from);

const computeWindowBedtime = (index: number): number =>
  WINDOW_BEDTIME.from +
  hashSeed(index + BEDTIME_SEED) * (WINDOW_BEDTIME.to - WINDOW_BEDTIME.from);

const toHomeWindow = (spot: WindowSpot, index: number): LitWindow => ({
  placements: createGlowPlacements(getHomeWindowArt(index), spot),
  dusk: computeWindowDusk(index),
  bedtime: computeWindowBedtime(index),
});

const toLitWindow = (spot: WindowSpot, index: number): LitWindow =>
  match(spot.cell.code)
    .with(SHOP_WINDOW, () => ({
      placements: createGlowPlacements(LIT_SHOP, spot),
      dusk: SHOP_HOURS.dusk,
      bedtime: SHOP_HOURS.bedtime,
    }))
    .otherwise(() => toHomeWindow(spot, index));

/**
 * Finds every window of the buildings and decides when each one is lit.
 * Home windows light up one by one as night falls and go dark one by one
 * late at night; a few glow blue from a television. Shop windows light up
 * together at dusk and go dark at closing time.
 */
export const createLitWindows = (buildings: readonly Building[]): LitWindow[] =>
  pipe(
    buildings,
    (all) => flatMap(all, findWindowSpots),
    (spots) => map(spots, toLitWindow),
  );
