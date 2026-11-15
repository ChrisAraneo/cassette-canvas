import type { SpritePlacement } from '@cassette-canvas/engine';
import { flatMap, map, range } from 'lodash-es';
import { LAMP_POST, SIDEWALK, TREE } from '../../art/street/consts';
import { SPRITE_SIZE } from '../../consts';
import { toTilePlacements } from '../../tiles/to-tile-placements';
import {
  LAMP_COLUMNS,
  LAMP_ROW,
  SCREEN_WIDTH,
  SIDEWALK_ROW,
  TREE_COLUMNS,
  TREE_ROW,
} from '../consts';

const SIDEWALK_BANDS = 2;

const createPavementBandPlacements = (band: number): SpritePlacement[] =>
  map(range(0, SCREEN_WIDTH, SPRITE_SIZE), (column) => ({
    id: `sidewalk-${band}-${column}`,
    sprite: SIDEWALK,
    row: SIDEWALK_ROW + band * SPRITE_SIZE,
    column,
    castsShadow: false,
  }));

const createPavementPlacements = (): SpritePlacement[] =>
  flatMap(range(SIDEWALK_BANDS), createPavementBandPlacements);

const createTreePlacements = (): SpritePlacement[] =>
  flatMap(TREE_COLUMNS, (column, index) =>
    toTilePlacements(TREE, {
      id: `tree-${index}`,
      row: TREE_ROW,
      column,
      castsShadow: true,
    }),
  );

const createLampPlacements = (): SpritePlacement[] =>
  flatMap(LAMP_COLUMNS, (column, index) =>
    toTilePlacements(LAMP_POST, {
      id: `lamp-${index}`,
      row: LAMP_ROW,
      column,
      castsShadow: false,
    }),
  );

/**
 * Places the sidewalk in front of the buildings, with its trees and lamp
 * posts. Trees cast shadows. Lamp posts do not, so they never block their
 * own light.
 */
export const createSidewalkPlacements = (): SpritePlacement[] => [
  ...createPavementPlacements(),
  ...createTreePlacements(),
  ...createLampPlacements(),
];
