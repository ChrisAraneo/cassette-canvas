import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import type { Hud } from '../types/hud';
import type { HudPanel } from '../types/hud-panel';
import type { HudWindow } from '../types/hud-window';
import { computeWidgetRect } from './compute-widget-rect';
import { paintPanel } from './paint-panel';
import { toWindowTheme } from './to-window-theme';

/**
 * Returns the paint steps for a panel widget: the same raised surface a
 * window is built from, without a title bar, so nothing can drag it.
 */
export const paintHudPanel = (
  hud: Hud,
  window: HudWindow,
  widget: HudPanel,
): readonly OverlayPaint[] =>
  paintPanel(computeWidgetRect(widget), toWindowTheme(hud, window));
