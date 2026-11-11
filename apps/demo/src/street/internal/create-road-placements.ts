import type { Sprite, SpritePlacement } from '@cassette-canvas/engine';
import { flatMap, map, range } from 'lodash-es';
import { match } from 'ts-pattern';
import { ASPHALT, CURB, LANE_MARK, NEAR_CURB } from '../../art/street/consts';
import { SPRITE_SIZE } from '../../consts';
import {
  LANE_MARK_ROW,
  LANE_MARK_SPACING,
  NEAR_CURB_ROW,
  ROAD_ROW,
  SCREEN_WIDTH,
} from '../consts';

const pickRoadSprite = (row: number, column: number): Sprite =>
  match(row)
    .with(ROAD_ROW, () => CURB)
    .with(NEAR_CURB_ROW, () => NEAR_CURB)
    .with(LANE_MARK_ROW, () =>
      match(column % LANE_MARK_SPACING)
        .with(0, () => LANE_MARK)
        .otherwise(() => ASPHALT),
    )
    .otherwise(() => ASPHALT);

/**
 * Places the road from the far curb to the near one, with a dashed line
 * between the two lanes.
 */
export const createRoadPlacements = (): SpritePlacement[] =>
  flatMap(range(ROAD_ROW, NEAR_CURB_ROW + 1, SPRITE_SIZE), (row) =>
    map(range(0, SCREEN_WIDTH, SPRITE_SIZE), (column) => ({
      id: `road-${row}-${column}`,
      sprite: pickRoadSprite(row, column),
      row,
      column,
      castsShadow: false,
    })),
  );
