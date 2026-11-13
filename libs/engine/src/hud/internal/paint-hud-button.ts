import { floor } from 'lodash-es';
import { match } from 'ts-pattern';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { toTextPaint } from '../../text/to-text-paint';
import { HUD_PRESS_SHIFT, HUD_TEXT_TOP } from '../consts';
import type { Hud } from '../types/hud';
import type { HudButton } from '../types/hud-button';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';
import type { HudWindow } from '../types/hud-window';
import { computeTextWidth } from './compute-text-width';
import { computeWidgetRect } from './compute-widget-rect';
import { isHeld } from './is-held';
import { paintBevel } from './paint-bevel';
import { toWindowTheme } from './to-window-theme';

const paintFace = (
  rect: HudRect,
  theme: HudTheme,
  held: boolean,
): readonly OverlayPaint[] =>
  match(held)
    .with(true, () =>
      paintBevel(
        rect,
        toPixel(theme.color, theme.shadow),
        toPixel(theme.color, theme.highlight),
      ),
    )
    .otherwise(() =>
      paintBevel(
        rect,
        toPixel(theme.color, theme.highlight),
        toPixel(theme.color, theme.shadow),
      ),
    );

/**
 * A button: a light raised face with dark text in the middle of it. While
 * the pointer holds it, the bevel turns around and the text moves one pixel
 * down and right, so it looks pressed in.
 */
export const paintHudButton = (
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
    ...paintFace(rect, theme, held),
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
