import { floor } from 'lodash-es';
import { match } from 'ts-pattern';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { toTextPaint } from '../../text/to-text-paint';
import { HUD_PRESS_SHIFT, HUD_TEXT_TOP } from '../consts';
import type { Hud } from '../types/hud';
import type { HudButton } from '../types/hud-button';
import type { HudWindow } from '../types/hud-window';
import { computeTextWidth } from './compute-text-width';
import { computeWidgetRect } from './compute-widget-rect';
import { drawFace } from './draw-face';
import { isHeld } from './is-held';
import { toWindowTheme } from './to-window-theme';

/**
 * Returns the paint steps for a button: a light raised face with dark text
 * in the middle of it. While the pointer holds it, the bevel swaps its light
 * and shadow sides and the text moves one pixel down and right, so it looks
 * pressed in.
 */
export const drawHudButton = (
  hud: Hud,
  window: HudWindow,
  widget: HudButton,
): readonly OverlayPaint[] => {
  const theme = toWindowTheme(hud, window);
  const rect = computeWidgetRect(widget);
  const held = isHeld(hud, window.id, widget.id);
  const shift = match(held)
    .with(true, () => HUD_PRESS_SHIFT)
    .otherwise(() => 0);

  return [
    { pixel: toPixel(theme.color, theme.face), ...rect },
    ...drawFace(rect, theme, held),
    toTextPaint(
      widget.text,
      toPixel(theme.color, theme.text),
      rect.row + HUD_TEXT_TOP + shift,
      rect.column +
        floor((rect.width - computeTextWidth(widget.text)) / 2) +
        shift,
    ),
  ];
};
