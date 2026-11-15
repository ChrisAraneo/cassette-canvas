import type { SpritePlacement, SpriteLegend } from '@cassette-canvas/engine';
import { flatMap } from 'lodash-es';
import { toTilePlacements } from '../tiles/to-tile-placements';
import { toTiles } from '../tiles/to-tiles';
import {
  BUILDINGS,
  SKYLINE_DAY_LEGEND,
  SKYLINE_NIGHT_LEGEND,
  SKYLINE_ROW,
  TOWERS,
} from './consts';
import { createBuildingPlacements } from './internal/create-building-placements';
import { createLitWindows } from './internal/create-lit-windows';
import { createRoadPlacements } from './internal/create-road-placements';
import { createSidewalkPlacements } from './internal/create-sidewalk-placements';
import { createSkylineArt } from './internal/create-skyline-art';
import { filterUncovered } from './internal/filter-uncovered';
import type { StreetScenery } from './types/street-scenery';

const createSkylinePlacements = (
  art: readonly string[],
  legend: SpriteLegend,
  buildings: readonly SpritePlacement[],
): SpritePlacement[] =>
  filterUncovered(
    toTilePlacements(toTiles(art, legend), {
      id: 'skyline',
      row: SKYLINE_ROW,
      column: 0,
      castsShadow: false,
    }),
    buildings,
  );

const toScenery = (
  skylineArt: readonly string[],
  buildings: readonly SpritePlacement[],
): StreetScenery => ({
  skyline: createSkylinePlacements(skylineArt, SKYLINE_DAY_LEGEND, buildings),
  nightSkyline: createSkylinePlacements(
    skylineArt,
    SKYLINE_NIGHT_LEGEND,
    buildings,
  ),
  buildings,
  windows: createLitWindows(BUILDINGS),
  sidewalk: createSidewalkPlacements(),
  road: createRoadPlacements(),
});

/**
 * Builds the parts of the street that do not move: the skyline by day and
 * by night, the buildings and their windows, the sidewalk, and the road.
 * Build it once and pass it to `createStreetScreen` on every frame.
 */
export const createStreetScenery = (): StreetScenery =>
  toScenery(
    createSkylineArt(TOWERS),
    flatMap(BUILDINGS, createBuildingPlacements),
  );
