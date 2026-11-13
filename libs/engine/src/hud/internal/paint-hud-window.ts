import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { toTextPaint } from '../../text/to-text-paint';
import { HUD_EDGE, HUD_PADDING, HUD_TEXT_TOP } from '../consts';
import type { Hud } from '../types/hud';
import type { HudWindow } from '../types/hud-window';
import { computeTitleRect } from './compute-title-rect';
import { insetRect } from './inset-rect';
import { paintBevel } from './paint-bevel';
import { paintCloseBox } from './paint-close-box';
import { toWindowTheme } from './to-window-theme';

/**
 * Returns the paint steps for a window without its widgets: a dark line
 * around a raised frame, the title bar with the title in it, the groove
 * under the bar, and the close box.
 */
export const paintHudWindow = (
  hud: Hud,
  window: HudWindow,
): readonly OverlayPaint[] => {
  const theme = toWindowTheme(hud, window);
  const edge = toPixel(theme.color, theme.edge);
  const shadow = toPixel(theme.color, theme.shadow);
  const frame = {
    row: 0,
    column: 0,
    width: window.width,
    height: window.height,
  };
  const title = computeTitleRect(window);

  return [
    { pixel: toPixel(theme.color, theme.body), ...frame },
    ...paintBevel(frame, edge, edge),
    ...paintBevel(
      insetRect(frame, HUD_EDGE),
      toPixel(theme.color, theme.highlight),
      shadow,
    ),
    { pixel: toPixel(theme.color, theme.title), ...title },
    {
      pixel: shadow,
      row: title.row + title.height,
      column: title.column,
      width: title.width,
      height: 1,
    },
    toTextPaint(
      window.title,
      toPixel(theme.color, theme.text),
      title.row + HUD_TEXT_TOP,
      title.column + HUD_PADDING,
    ),
    ...paintCloseBox(hud, window),
  ];
};
