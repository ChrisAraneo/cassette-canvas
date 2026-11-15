import { match } from 'ts-pattern';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { TRANSPARENT } from '../../palette/consts';
import { toPixel } from '../../palette/to-pixel';
import { computeTextAdvance } from '../../text/compute-text-advance';
import { toTextPaint } from '../../text/to-text-paint';
import {
  HUD_CARET_HEIGHT,
  HUD_CARET_WIDTH,
  HUD_PADDING,
  HUD_TEXT_TOP,
} from '../consts';
import type { Hud } from '../types/hud';
import type { HudInput } from '../types/hud-input';
import type { HudRect } from '../types/hud-rect';
import type { HudWindow } from '../types/hud-window';
import { computeWidgetRect } from './compute-widget-rect';
import { drawSunken } from './draw-sunken';
import { isFocused } from './is-focused';
import { sliceFieldText } from './slice-field-text';
import { toWindowTheme } from './to-window-theme';

const computeCaretWidth = (focused: boolean): number =>
  match(focused)
    .with(true, () => HUD_CARET_WIDTH)
    .otherwise(() => 0);

const computeFieldRoom = (rect: HudRect, focused: boolean): number =>
  rect.width - 2 * HUD_PADDING - computeCaretWidth(focused);

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
    {
      pixel: match(focused)
        .with(true, () => text)
        .otherwise(() => TRANSPARENT),
      row: rect.row + HUD_TEXT_TOP,
      column: rect.column + HUD_PADDING + computeTextAdvance(shown),
      width: HUD_CARET_WIDTH,
      height: HUD_CARET_HEIGHT,
    },
  ];
};
