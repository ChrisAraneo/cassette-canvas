import { match } from 'ts-pattern';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { TRANSPARENT } from '../../palette/consts';
import { toPixel } from '../../palette/to-pixel';
import { measureText } from '../../text/measure-text';
import { toTextPaint } from '../../text/to-text-paint';
import {
  HUD_CARET_HEIGHT,
  HUD_CARET_WIDTH,
  HUD_PADDING,
  HUD_TEXT_TOP,
} from '../consts';
import type { Hud } from '../types/hud';
import type { HudInput } from '../types/hud-input';
import type { HudWindow } from '../types/hud-window';
import { computeWidgetRect } from './compute-widget-rect';
import { isFocused } from './is-focused';
import { paintBevel } from './paint-bevel';
import { toFieldText } from './to-field-text';
import { toWindowTheme } from './to-window-theme';

/**
 * Returns the paint steps for a field: a light surface sunk into the window,
 * with the end of its text on it. The focused field also shows a caret after
 * the text.
 */
export const paintHudInput = (
  hud: Hud,
  window: HudWindow,
  widget: HudInput,
): readonly OverlayPaint[] => {
  const theme = toWindowTheme(hud, window);
  const text = toPixel(theme.color, theme.text);
  const rect = computeWidgetRect(widget);
  const focused = isFocused(hud, window.id, widget.id);
  const caret = match(focused)
    .with(true, () => HUD_CARET_WIDTH)
    .otherwise(() => 0);
  const shown = toFieldText(widget.text, rect.width - 2 * HUD_PADDING - caret);
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
      column: rect.column + HUD_PADDING + measureText(shown),
      width: HUD_CARET_WIDTH,
      height: HUD_CARET_HEIGHT,
    },
  ];
};
