import { constant, reduce, times } from 'lodash-es';
import { pipe } from 'remeda';
import { TRANSPARENT } from '../palette/consts';
import { drawPaint } from './internal/draw-paint';
import { toCount } from './internal/to-count';
import type { Overlay } from './types/overlay';
import type { OverlayPaint } from './types/overlay-paint';

// Style guide - Appendix B exception 1 (hot numeric kernel).
// As a pipeline (one object per painted pixel, a filter, then edits keyed by
// the overlay row), painting a HUD (two windows, 71 paints, 14,860 pixels)
// took 6.9 ms per frame (Vite bundle, Node 24). These loops take 0.5 ms. The
// loops live in draw-fill.ts and draw-image.ts; the step each paint takes is
// a `match`, since it runs once per paint rather than once per pixel. They
// only change the array this function creates itself, and the array does not
// change after it returns it.
/**
 * Draws a list of steps into a new overlay of `width` by `height`. The
 * steps are drawn in order, so later steps cover earlier ones. Parts
 * outside the overlay are cut off, and transparent pixels leave what is
 * below.
 */
export const drawOverlay = (
  width: number,
  height: number,
  paints: readonly OverlayPaint[],
): Overlay =>
  pipe(
    { columns: toCount(width), rows: toCount(height) },
    ({ columns, rows }) => ({
      columns,
      rows,
      pixels: times(columns * rows, constant(TRANSPARENT)),
    }),
    ({ columns, rows, pixels }) => ({
      width: columns,
      height: rows,
      pixels: reduce(
        paints,
        (drawn, paint) => drawPaint(drawn, columns, rows, paint),
        pixels,
      ),
    }),
  );
