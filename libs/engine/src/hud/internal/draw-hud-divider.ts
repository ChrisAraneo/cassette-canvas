import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import type { Hud } from '../types/hud';
import type { HudDivider } from '../types/hud-divider';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';
import type { HudWindow } from '../types/hud-window';
import { computeWidgetRect } from './compute-widget-rect';
import { drawGroove } from './draw-groove';
import { toWindowTheme } from './to-window-theme';

const drawThemedGroove = (
  rect: HudRect,
  theme: HudTheme,
): readonly OverlayPaint[] =>
  drawGroove(
    rect,
    toPixel(theme.color, theme.shadow),
    toPixel(theme.color, theme.highlight),
  );

/**
 * Returns the paint steps for a divider: a line pressed into the window,
 * which separates what is above it from what is below.
 */
export const drawHudDivider = (
  hud: Hud,
  window: HudWindow,
  widget: HudDivider,
): readonly OverlayPaint[] =>
  drawThemedGroove(computeWidgetRect(widget), toWindowTheme(hud, window));
