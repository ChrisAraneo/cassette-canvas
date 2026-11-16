import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import type { HudRect } from '../types/hud-rect';

/**
 * Returns the two lines that make a groove along the top of a rectangle:
 * `shadow` on the first row and `highlight` on the one below it, the way a
 * line pressed into a surface catches the light from the top left. A divider
 * is one of these, and so is every line between two items of a list.
 */
export const drawGroove = (
  { row, column, width }: HudRect,
  highlight: number,
  shadow: number,
): readonly OverlayPaint[] => [
  { pixel: shadow, row, column, width, height: 1 },
  { pixel: highlight, row: row + 1, column, width, height: 1 },
];
