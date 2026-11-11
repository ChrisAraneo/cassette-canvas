import {
  COLOR_COUNT,
  SHADE_COUNT,
  type SpritePlacement,
  toPixel,
} from '@cassette-canvas/engine';
import { flatMap, map, range } from 'lodash-es';
import { SPRITE_SIZE } from '../../consts';
import { SWATCH_LEFT, SWATCH_TOP } from '../consts';
import { createSwatchSprite } from './create-swatch-sprite';

export const createSwatchPlacements = (): SpritePlacement[] =>
  flatMap(range(COLOR_COUNT), (color) =>
    map(range(SHADE_COUNT), (shade) => ({
      id: `swatch-${color}-${shade}`,
      sprite: createSwatchSprite(toPixel(color, shade)),
      row: SWATCH_TOP + shade * SPRITE_SIZE,
      column: SWATCH_LEFT + color * SPRITE_SIZE,
      castsShadow: false,
    })),
  );
