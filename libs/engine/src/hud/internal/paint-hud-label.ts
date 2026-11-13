import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { toTextPaint } from '../../text/to-text-paint';
import type { Hud } from '../types/hud';
import type { HudLabel } from '../types/hud-label';
import type { HudWindow } from '../types/hud-window';
import { computeWidgetRect } from './compute-widget-rect';
import { toWindowTheme } from './to-window-theme';

/** A label: dark text on the window, and nothing else. */
export const paintHudLabel = (
  hud: Hud,
  window: HudWindow,
  widget: HudLabel,
): readonly OverlayPaint[] => {
  const theme = toWindowTheme(hud, window);
  const rect = computeWidgetRect(widget);

  return [
    toTextPaint(
      widget.text,
      toPixel(theme.color, theme.text),
      rect.row,
      rect.column,
    ),
  ];
};
