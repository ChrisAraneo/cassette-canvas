import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import type { HudRect } from '../types/hud-rect';

/**
 * The four lines that make a rectangle look raised: `light` along the top
 * and the left, `shadow` along the bottom and the right. Swap the two to
 * make it look pressed in. The corners where the two meet go to `shadow`,
 * the way a light from the top left leaves them.
 */
export const paintBevel = (
  { row, column, width, height }: HudRect,
  light: number,
  shadow: number,
): readonly OverlayPaint[] => [
  { pixel: light, row, column, width, height: 1 },
  { pixel: light, row, column, width: 1, height },
  { pixel: shadow, row: row + height - 1, column, width, height: 1 },
  { pixel: shadow, row, column: column + width - 1, width: 1, height },
];
