import { floor } from 'lodash-es';
import { match } from 'ts-pattern';
import { toOverlay } from '../../overlay/to-overlay';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { TEXT_INK } from '../../text/consts';
import { HUD_CLOSE_ART, HUD_PRESS_SHIFT } from '../consts';
import type { Hud } from '../types/hud';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';
import type { HudWindow } from '../types/hud-window';
import { computeCloseRect } from './compute-close-rect';
import { paintBevel } from './paint-bevel';
import { toWindowTheme } from './to-window-theme';

const CLOSE_ART_SIZE = 5;

const isClosing = (hud: Hud, window: HudWindow): boolean =>
  match(hud.grab)
    .with({ kind: 'close', window: window.id }, () => true)
    .otherwise(() => false);

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
 * Returns the paint steps for the close box: a raised square with an X in
 * it, pressed in while the pointer holds it. Returns no steps when the
 * window cannot be closed.
 */
export const paintCloseBox = (
  hud: Hud,
  window: HudWindow,
): readonly OverlayPaint[] =>
  match(window.closable)
    .with(false, (): readonly OverlayPaint[] => [])
    .otherwise(() => {
      const theme = toWindowTheme(hud, window);
      const rect = computeCloseRect(window);
      const held = isClosing(hud, window);
      const shift = match(held)
        .with(true, () => HUD_PRESS_SHIFT)
        .otherwise(() => 0);
      const inset = floor((rect.width - CLOSE_ART_SIZE) / 2);

      return [
        { pixel: toPixel(theme.color, theme.face), ...rect },
        ...paintFace(rect, theme, held),
        {
          image: toOverlay(HUD_CLOSE_ART, {
            [TEXT_INK]: toPixel(theme.color, theme.text),
          }),
          row: rect.row + inset + shift,
          column: rect.column + inset + shift,
        },
      ];
    });
