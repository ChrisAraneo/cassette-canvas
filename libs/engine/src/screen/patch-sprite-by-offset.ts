import { match, P } from 'ts-pattern';
import { findSprite } from './find-sprite';
import { patchSprite } from './patch-sprite';
import type { Screen } from './types/screen';

const { nonNullable } = P;

/**
 * Moves a sprite `rowOffset` pixels down and `columnOffset` pixels right.
 * Negative values move it up and left. Returns a new screen. If no sprite
 * has the id, nothing changes.
 */
export const patchSpriteByOffset = (
  screen: Screen,
  id: string,
  rowOffset: number,
  columnOffset: number,
): Screen =>
  match(findSprite(screen, id))
    .with(nonNullable, ({ row, column }) =>
      patchSprite(screen, id, {
        row: row + rowOffset,
        column: column + columnOffset,
      }),
    )
    .otherwise(() => screen);
