import { match, P } from 'ts-pattern';
import { findLight } from './find-light';
import { patchLight } from './patch-light';
import type { Screen } from './types/screen';

const { nonNullable } = P;

/**
 * Moves a light `rowOffset` pixels down and `columnOffset` pixels right.
 * Negative values move it up and left. Returns a new screen. If no light has
 * the id, nothing changes.
 */
export const patchLightByOffset = (
  screen: Screen,
  id: string,
  rowOffset: number,
  columnOffset: number,
): Screen =>
  match(findLight(screen, id))
    .with(nonNullable, ({ row, column }) =>
      patchLight(screen, id, {
        row: row + rowOffset,
        column: column + columnOffset,
      }),
    )
    .otherwise(() => screen);
