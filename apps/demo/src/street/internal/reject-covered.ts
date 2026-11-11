import { isPixel, type SpritePlacement } from '@cassette-canvas/engine';
import { every, flatMap, floor, reject } from 'lodash-es';
import { match } from 'ts-pattern';
import { SPRITE_SIZE } from '../../consts';

const toPixelKeys = ({ sprite, row, column }: SpritePlacement): string[] =>
  flatMap(sprite, (pixel, index) =>
    match(isPixel(pixel))
      .with(true, () => [
        `${row + floor(index / SPRITE_SIZE)}:${column + (index % SPRITE_SIZE)}`,
      ])
      .otherwise(() => []),
  );

const rejectInSet = (
  placements: readonly SpritePlacement[],
  covered: ReadonlySet<string>,
): SpritePlacement[] =>
  reject(placements, (placement) =>
    every(toPixelKeys(placement), (key) => covered.has(key)),
  );

/**
 * Leaves out the placements whose every visible pixel sits under a visible
 * pixel of `covers`. They would never show, but they would still cost time
 * to draw on every frame.
 */
export const rejectCovered = (
  placements: readonly SpritePlacement[],
  covers: readonly SpritePlacement[],
): SpritePlacement[] =>
  rejectInSet(placements, new Set(flatMap(covers, toPixelKeys)));
