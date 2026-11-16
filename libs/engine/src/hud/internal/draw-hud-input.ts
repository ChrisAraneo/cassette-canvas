import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { toTextPaint } from '../../text/to-text-paint';
import { HUD_PADDING, HUD_TEXT_TOP } from '../consts';
import type { Hud } from '../types/hud';
import type { HudInput } from '../types/hud-input';
import type { HudWindow } from '../types/hud-window';
import { computeFieldRoom } from './compute-field-room';
import { computeWidgetRect } from './compute-widget-rect';
import { drawCaret } from './draw-caret';
import { drawSunken } from './draw-sunken';
import { isFocused } from './is-focused';
import { sliceFieldText } from './slice-field-text';
import { toWindowTheme } from './to-window-theme';

/**
 * Returns the paint steps for a field: a light surface sunk into the window,
 * with the end of its text on it. The focused field also shows a caret after
 * the text.
 */
export const drawHudInput = (
  hud: Hud,
  window: HudWindow,
  widget: HudInput,
): readonly OverlayPaint[] => {
  const theme = toWindowTheme(hud, window);
  const text = toPixel(theme.color, theme.text);
  const rect = computeWidgetRect(widget);
  const focused = isFocused(hud, window.id, widget.id);
  const shown = sliceFieldText(widget.text, computeFieldRoom(rect, focused));

  return [
    ...drawSunken(rect, theme),
    toTextPaint(
      shown,
      text,
      rect.row + HUD_TEXT_TOP,
      rect.column + HUD_PADDING,
    ),
    drawCaret(rect, shown, text, focused),
  ];
};
