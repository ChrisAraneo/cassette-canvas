import { floor, map, take } from 'lodash-es';
import type { SpritePlacement } from '../../screen/types/sprite-placement';
import type { FramePixel } from './types/frame-pixel';

export const computeSpritePixels = (
  { sprite, row, column, castsShadow }: SpritePlacement,
  spriteSize: number,
): FramePixel[] =>
  map(take(sprite, spriteSize * spriteSize), (pixel, index) => ({
    row: floor(row) + floor(index / spriteSize),
    column: floor(column) + (index % spriteSize),
    pixel,
    castsShadow,
  }));
