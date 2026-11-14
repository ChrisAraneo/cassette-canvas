import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import type { HudRect } from '../types/hud-rect';

/**
 * Returns the two lines that make a groove along the top of a rectangle:
 * `shadow` on the first row and `light` on the one below it, the way a line
 * pressed into a surface catches the light from the top left. A divider is
 * one of these, and so is every line between two items of a list.
 */
export const paintGroove = (
  { row, column, width }: HudRect,
  shadow: number,
  light: number,
): readonly OverlayPaint[] => [
  { pixel: shadow, row, column, width, height: 1 },
  { pixel: light, row: row + 1, column, width, height: 1 },
];
