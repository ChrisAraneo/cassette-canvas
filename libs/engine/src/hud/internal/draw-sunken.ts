import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { HUD_EDGE } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';
import { drawBevel } from './draw-bevel';

const drawInnerShadow = (rect: HudRect, theme: HudTheme): OverlayPaint => ({
  pixel: toPixel(theme.color, theme.shadow),
  row: rect.row + HUD_EDGE,
  column: rect.column + HUD_EDGE,
  width: rect.width - 2 * HUD_EDGE,
  height: HUD_EDGE,
});

/**
 * Returns the paint steps for a surface sunk into a window: the highlight
 * shade under a dark line, with a shadow line inside its top edge, the way
 * a hole in a surface catches the light from the top left. A field and a
 * list both sit in one.
 */
export const drawSunken = (
  rect: HudRect,
  theme: HudTheme,
): readonly OverlayPaint[] => {
  const edge = toPixel(theme.color, theme.edge);

  return [
    { pixel: toPixel(theme.color, theme.highlight), ...rect },
    ...drawBevel(rect, edge, edge),
    drawInnerShadow(rect, theme),
  ];
};
