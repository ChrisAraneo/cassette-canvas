import type { SpritePlacement } from '@cassette-canvas/engine';
import { map, range } from 'lodash-es';
import { GRASS } from '../../art/consts';
import { GROUND_ROW, SCREEN_WIDTH, SPRITE_SIZE } from '../consts';

export const createGroundPlacements = (): SpritePlacement[] =>
  map(range(0, SCREEN_WIDTH, SPRITE_SIZE), (column) => ({
    id: `ground-${column}`,
    sprite: GRASS,
    row: GROUND_ROW,
    column,
    castsShadow: false,
  }));
