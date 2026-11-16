import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { HUD_EDGE } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';
import { computeInsetRect } from './compute-inset-rect';
import { drawBevel } from './draw-bevel';
import { drawEdge } from './draw-edge';

/**
 * Returns the paint steps for a panel: the body shade under a dark line,
 * with a raised bevel inside that line. A window is painted as a panel with
 * a title bar on it, and the `PANEL` widget is one on its own.
 */
export const drawPanel = (
  rect: HudRect,
  theme: HudTheme,
): readonly OverlayPaint[] => [
  { pixel: toPixel(theme.color, theme.body), ...rect },
  ...drawEdge(rect, theme),
  ...drawBevel(
    computeInsetRect(rect, HUD_EDGE),
    toPixel(theme.color, theme.highlight),
    toPixel(theme.color, theme.shadow),
  ),
];
