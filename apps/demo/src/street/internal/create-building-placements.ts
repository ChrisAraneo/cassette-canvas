import { type SpritePlacement, toSprite } from '@cassette-canvas/engine';
import { flatMap } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { FACADE_ARTS } from '../../art/city/consts';
import { SPRITE_SIZE } from '../../consts';
import type { Building } from '../types/building';
import { computeBuildingTop } from './compute-building-top';
import { toGridCells } from './to-grid-cells';
import type { GridCell } from './types/grid-cell';

const { nonNullable } = P;

const createCellPlacements = (
  { id, column, legend }: Building,
  top: number,
  cell: GridCell,
): SpritePlacement[] =>
  match(FACADE_ARTS[cell.code])
    .with(nonNullable, (art) => [
      {
        id: `${id}-${cell.row}-${cell.column}`,
        sprite: toSprite(art, legend),
        row: top + cell.row * SPRITE_SIZE,
        column: column + cell.column * SPRITE_SIZE,
        castsShadow: false,
      },
    ])
    .otherwise(() => []);

/**
 * Places the facade tiles of a building, standing on the sidewalk. Codes
 * that are not facade tiles, such as a space, leave the tile empty.
 * Buildings do not cast shadows, so lamps light their walls.
 */
export const createBuildingPlacements = (
  building: Building,
): SpritePlacement[] =>
  flatMap(toGridCells(building.grid), (cell) =>
    createCellPlacements(building, computeBuildingTop(building), cell),
  );
