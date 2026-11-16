import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import type { Hud } from '../types/hud';
import type { HudDivider } from '../types/hud-divider';
import type { HudWindow } from '../types/hud-window';
import { computeWidgetRect } from './compute-widget-rect';
import { drawThemedGroove } from './draw-themed-groove';
import { toWindowTheme } from './to-window-theme';

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
