import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { HUD_EDGE } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';
import { insetRect } from './inset-rect';
import { paintBevel } from './paint-bevel';

/**
 * Returns the paint steps for a panel: the body shade under a dark line,
 * with a raised bevel inside that line. A window is painted as a panel with
 * a title bar on it, and the `panel` widget is one on its own.
 */
export const paintPanel = (
  rect: HudRect,
  theme: HudTheme,
): readonly OverlayPaint[] => {
  const edge = toPixel(theme.color, theme.edge);

  return [
    { pixel: toPixel(theme.color, theme.body), ...rect },
    ...paintBevel(rect, edge, edge),
    ...paintBevel(
      insetRect(rect, HUD_EDGE),
      toPixel(theme.color, theme.highlight),
      toPixel(theme.color, theme.shadow),
    ),
  ];
};
