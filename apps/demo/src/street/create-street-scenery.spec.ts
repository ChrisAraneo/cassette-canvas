import { filter, flatMap, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toTiles } from '../tiles/to-tiles';
import { BUILDINGS, SKYLINE_DAY_LEGEND, TOWERS } from './consts';
import { createStreetScenery } from './create-street-scenery';
import { createBuildingPlacements } from './internal/create-building-placements';
import { createSkylineArt } from './internal/create-skyline-art';
import { toGridCells } from './internal/to-grid-cells';

const SCENERY = createStreetScenery();

describe('createStreetScenery', () => {
  it('should return no skyline tiles that the buildings hide when it builds the street', () => {
    expect(size(SCENERY.skyline)).toBeLessThan(
      size(toTiles(createSkylineArt(TOWERS), SKYLINE_DAY_LEGEND)),
    );
  });

  it('should return the night skyline where the day skyline is when it builds the street', () => {
    expect(
      map(SCENERY.nightSkyline, ({ row, column }) => [row, column]),
    ).toEqual(map(SCENERY.skyline, ({ row, column }) => [row, column]));
  });

  it('should return some skyline windows lit when it is night', () => {
    expect(SCENERY.nightSkyline).not.toEqual(SCENERY.skyline);
  });

  it('should return every building when it builds the street', () => {
    expect(SCENERY.buildings).toEqual(
      flatMap(BUILDINGS, createBuildingPlacements),
    );
  });

  it('should return every home window and shop window when it builds the street', () => {
    expect(size(SCENERY.windows)).toBe(
      size(
        filter(
          flatMap(BUILDINGS, ({ grid }) => toGridCells(grid)),
          ({ code }) => code === 'W' || code === 'S',
        ),
      ),
    );
  });

  it('should return the sidewalk and the road when it builds the street', () => {
    expect([size(SCENERY.sidewalk) > 0, size(SCENERY.road) > 0]).toEqual([
      true,
      true,
    ]);
  });
});
