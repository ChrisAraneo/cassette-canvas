import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';
import { paintBevel } from './paint-bevel';

/**
 * Returns the paint steps for a surface sunk into a window: the highlight
 * shade under a dark line, with a shadow line inside its top edge, the way
 * a hole in a surface catches the light from the top left. A field and a
 * list both sit in one.
 */
export const paintSunken = (
  rect: HudRect,
  theme: HudTheme,
): readonly OverlayPaint[] => {
  const edge = toPixel(theme.color, theme.edge);

  return [
    { pixel: toPixel(theme.color, theme.highlight), ...rect },
    ...paintBevel(rect, edge, edge),
    {
      pixel: toPixel(theme.color, theme.shadow),
      row: rect.row + 1,
      column: rect.column + 1,
      width: rect.width - 2,
      height: 1,
    },
  ];
};
