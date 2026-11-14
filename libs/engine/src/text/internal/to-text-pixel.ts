import { last } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { TRANSPARENT } from '../../palette/consts';
import type { TextPixels } from '../types/text-pixels';

const { number } = P;

/**
 * Returns the pixel value the character at `index` is drawn in: the single
 * pixel of a line that has one, or the pixel at that place in a list. A
 * character past the end of a list takes the last pixel in it, and an empty
 * list leaves the character transparent.
 */
export const toTextPixel = (pixels: TextPixels, index: number): number =>
  match(pixels)
    .with(number, (pixel) => pixel)
    .otherwise((list) => list[index] ?? last(list) ?? TRANSPARENT);
