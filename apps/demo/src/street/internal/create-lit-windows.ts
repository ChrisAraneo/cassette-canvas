import { filter, flatMap, includes, map } from 'lodash-es';
import { match } from 'ts-pattern';
import { LIT_SHOP, TV_WINDOW, WARM_WINDOW } from '../../art/city/consts';
import { SPRITE_SIZE } from '../../consts';
import { computeHash } from '../../math/compute-hash';
import { placeTiles } from '../../tiles/place-tiles';
import type { Tile } from '../../tiles/types/tile';
import { SHOP_HOURS, TV_SHARE, WINDOW_BEDTIME, WINDOW_DUSK } from '../consts';
import type { Building } from '../types/building';
import type { GridCell } from '../types/grid-cell';
import type { LitWindow } from '../types/lit-window';
import { computeBuildingTop } from './compute-building-top';
import { toGridCells } from './to-grid-cells';

const HOME_WINDOW = 'W';

const SHOP_WINDOW = 'S';

const WINDOW_CODES: readonly string[] = Object.freeze([
  HOME_WINDOW,
  SHOP_WINDOW,
]);

/** Keeps the hashes for the dusk and the bedtime of a window apart. */
const BEDTIME_SEED = 0.5;

interface WindowSpot {
  readonly building: Building;
  readonly cell: GridCell;
}

const findWindowSpots = (building: Building): WindowSpot[] =>
  map(
    filter(toGridCells(building.grid), ({ code }) =>
      includes(WINDOW_CODES, code),
    ),
    (cell) => ({ building, cell }),
  );

const placeGlow = (
  tiles: readonly Tile[],
  { building, cell }: WindowSpot,
): LitWindow['placements'] =>
  placeTiles(tiles, {
    id: `${building.id}-glow-${cell.row}-${cell.column}`,
    row: computeBuildingTop(building) + cell.row * SPRITE_SIZE,
    column: building.column + cell.column * SPRITE_SIZE,
    castsShadow: false,
  });

const toHomeWindow = (spot: WindowSpot, index: number): LitWindow => ({
  placements: placeGlow(
    match(computeHash(index) < TV_SHARE)
      .with(true, () => TV_WINDOW)
      .otherwise(() => WARM_WINDOW),
    spot,
  ),
  dusk:
    WINDOW_DUSK.from +
    computeHash(index + 1) * (WINDOW_DUSK.to - WINDOW_DUSK.from),
  bedtime:
    WINDOW_BEDTIME.from +
    computeHash(index + BEDTIME_SEED) *
      (WINDOW_BEDTIME.to - WINDOW_BEDTIME.from),
});

const toLitWindow = (spot: WindowSpot, index: number): LitWindow =>
  match(spot.cell.code)
    .with(SHOP_WINDOW, () => ({
      placements: placeGlow(LIT_SHOP, spot),
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
  map(flatMap(buildings, findWindowSpots), toLitWindow);
