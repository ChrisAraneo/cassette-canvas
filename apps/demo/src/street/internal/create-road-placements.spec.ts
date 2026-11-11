import type { SpritePlacement } from '@cassette-canvas/engine';
import { filter, find, map, size, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { ASPHALT, CURB, LANE_MARK, NEAR_CURB } from '../../art/street/consts';
import { SPRITE_SIZE } from '../../consts';
import {
  LANE_MARK_ROW,
  LANE_MARK_SPACING,
  NEAR_CURB_ROW,
  ROAD_ROW,
  SCREEN_WIDTH,
} from '../consts';
import { createRoadPlacements } from './create-road-placements';

const findTile = (row: number, column: number): SpritePlacement | undefined =>
  find(createRoadPlacements(), { row, column });

describe('createRoadPlacements', () => {
  it('should pave every row from the far curb to the near one across the screen', () => {
    expect(size(createRoadPlacements())).toBe(
      ((NEAR_CURB_ROW - ROAD_ROW) / SPRITE_SIZE + 1) *
        (SCREEN_WIDTH / SPRITE_SIZE),
    );
  });

  it('should put a curb at both edges of the road', () => {
    expect([
      findTile(ROAD_ROW, 0)?.sprite,
      findTile(NEAR_CURB_ROW, 0)?.sprite,
    ]).toEqual([CURB, NEAR_CURB]);
  });

  it('should dash the line between the lanes when it paves the middle row', () => {
    expect(
      map(
        filter(createRoadPlacements(), { row: LANE_MARK_ROW }),
        ({ sprite }) => sprite === LANE_MARK,
      ),
    ).toEqual(
      map(
        filter(createRoadPlacements(), { row: LANE_MARK_ROW }),
        ({ column }) => column % LANE_MARK_SPACING === 0,
      ),
    );
  });

  it('should pave the lanes with plain asphalt', () => {
    expect(
      uniq(
        map(
          filter(createRoadPlacements(), {
            row: LANE_MARK_ROW + SPRITE_SIZE,
          }),
          'sprite',
        ),
      ),
    ).toEqual([ASPHALT]);
  });
});
