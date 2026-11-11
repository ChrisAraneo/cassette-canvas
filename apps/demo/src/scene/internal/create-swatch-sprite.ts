import { type Sprite, TRANSPARENT } from '@cassette-canvas/engine';
import { floor, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { SPRITE_SIZE } from '../consts';

const LAST_INDEX = SPRITE_SIZE - 1;

const isSwatchGap = (index: number): boolean =>
  index % SPRITE_SIZE === LAST_INDEX ||
  floor(index / SPRITE_SIZE) === LAST_INDEX;

export const createSwatchSprite = (pixel: number): Sprite =>
  times(SPRITE_SIZE * SPRITE_SIZE, (index) =>
    match(isSwatchGap(index))
      .with(true, () => TRANSPARENT)
      .otherwise(() => pixel),
  );
