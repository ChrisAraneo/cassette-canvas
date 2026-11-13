import type { HudRect } from '../types/hud-rect';

/** Returns true when the logical pixel at `row` and `column` is in the rectangle. */
export const isInside = (
  { row, column, width, height }: HudRect,
  pixelRow: number,
  pixelColumn: number,
): boolean =>
  pixelRow >= row &&
  pixelRow < row + height &&
  pixelColumn >= column &&
  pixelColumn < column + width;
