import { toSprite } from '@cassette-canvas/engine';
import { every, map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FACADE_ARTS, FACADE_LEGENDS } from '../../art/city/consts';
import { SPRITE_SIZE } from '../../consts';
import { SIDEWALK_ROW } from '../consts';
import { createBuildingPlacements } from './create-building-placements';

const BUILDING = Object.freeze({
  id: 'shop',
  column: 40,
  legend: FACADE_LEGENDS.sand,
  grid: [' h', 'cc', 'xW', 'DV'],
});

describe('createBuildingPlacements', () => {
  it('should return one tile for each facade code when it builds the building', () => {
    expect(map(createBuildingPlacements(BUILDING), 'id')).toEqual([
      'shop-0-1',
      'shop-1-0',
      'shop-1-1',
      'shop-2-0',
      'shop-2-1',
      'shop-3-0',
      'shop-3-1',
    ]);
  });

  it('should return the bottom row of tiles on the sidewalk when it builds the building', () => {
    expect(createBuildingPlacements(BUILDING)[5]?.row).toBe(
      SIDEWALK_ROW - SPRITE_SIZE,
    );
  });

  it('should return each tile in its column when it builds the building', () => {
    expect(createBuildingPlacements(BUILDING)[0]?.column).toBe(
      40 + SPRITE_SIZE,
    );
  });

  it('should return each tile painted with the legend of the building when it builds the building', () => {
    expect(createBuildingPlacements(BUILDING)[1]?.sprite).toEqual(
      toSprite(FACADE_ARTS.c ?? [], FACADE_LEGENDS.sand),
    );
  });

  it('should return no shadow casters when it places a building, so the lamp light reaches the walls', () => {
    expect(
      every(createBuildingPlacements(BUILDING), { castsShadow: false }),
    ).toBe(true);
  });
});
