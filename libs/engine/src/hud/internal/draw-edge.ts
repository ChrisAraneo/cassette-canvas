import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';
import { drawBevel } from './draw-bevel';

/**
 * Returns the four lines of the dark edge around a rectangle, the same shade
 * on every side. A panel and a surface sunk into a window are both drawn
 * inside one of these.
 */
export const drawEdge = (
  rect: HudRect,
  theme: HudTheme,
): readonly OverlayPaint[] =>
  drawBevel(
    rect,
    toPixel(theme.color, theme.edge),
    toPixel(theme.color, theme.edge),
  );
