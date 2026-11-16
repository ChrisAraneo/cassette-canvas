import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';
import { drawEdge } from './draw-edge';
import { drawInnerShadow } from './draw-inner-shadow';

/**
 * Returns the paint steps for a surface sunk into a window: the highlight
 * shade under a dark line, with a shadow line inside its top edge, the way
 * a hole in a surface catches the light from the top left. A field and a
 * list both sit in one.
 */
export const drawSunken = (
  rect: HudRect,
  theme: HudTheme,
): readonly OverlayPaint[] => [
  { pixel: toPixel(theme.color, theme.highlight), ...rect },
  ...drawEdge(rect, theme),
  drawInnerShadow(rect, theme),
];
