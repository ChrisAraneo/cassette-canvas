import { constant, findLast } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { Hud } from '../types/hud';
import { computeWindowRect } from './compute-window-rect';
import { isInside } from './is-inside';
import { toWindowHit } from './to-window-hit';
import type { HudHit } from './types/hud-hit';

const { nonNullable } = P;

/**
 * Returns what the logical pixel at `row` and `column` is over, or
 * `undefined` when it is over no window at all. Windows on top are tried
 * first, and within a window the close box comes before the widgets, the
 * widgets before the title bar, and a button on an item of a list before the
 * list it sits on.
 */
export const findHudHit = (
  hud: Hud,
  row: number,
  column: number,
): HudHit | undefined =>
  match(
    findLast(hud.windows, (window) =>
      isInside(computeWindowRect(window), row, column),
    ),
  )
    .with(nonNullable, (window) =>
      toWindowHit(window, row - window.row, column - window.column),
    )
    .otherwise(constant(undefined));
