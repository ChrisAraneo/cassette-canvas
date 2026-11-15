import { floor } from 'lodash-es';
import { match } from 'ts-pattern';
import { toOverlay } from '../../overlay/to-overlay';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { TEXT_INK } from '../../text/consts';
import { HUD_CLOSE_ART, HUD_PRESS_SHIFT } from '../consts';
import type { Hud } from '../types/hud';
import type { HudWindow } from '../types/hud-window';
import { computeCloseRect } from './compute-close-rect';
import { drawFace } from './draw-face';
import { toWindowTheme } from './to-window-theme';

const CLOSE_ART_SIZE = 5;

const isClosing = (hud: Hud, window: HudWindow): boolean =>
  match(hud.grab)
    .with({ kind: 'CLOSE', window: window.id }, () => true)
    .otherwise(() => false);

const drawClosableBox = (
  hud: Hud,
  window: HudWindow,
): readonly OverlayPaint[] => {
  const theme = toWindowTheme(hud, window);
  const rect = computeCloseRect(window);
  const held = isClosing(hud, window);
  const shift = match(held)
    .with(true, () => HUD_PRESS_SHIFT)
    .otherwise(() => 0);
  const inset = floor((rect.width - CLOSE_ART_SIZE) / 2);

  return [
    { pixel: toPixel(theme.color, theme.face), ...rect },
    ...drawFace(rect, theme, held),
    {
      image: toOverlay(HUD_CLOSE_ART, {
        [TEXT_INK]: toPixel(theme.color, theme.text),
      }),
      row: rect.row + inset + shift,
      column: rect.column + inset + shift,
    },
  ];
};

/**
 * Returns the paint steps for the close box: a raised square with an X in
 * it, pressed in while the pointer holds it. Returns no steps when the
 * window cannot be closed.
 */
export const drawCloseBox = (
  hud: Hud,
  window: HudWindow,
): readonly OverlayPaint[] =>
  match(window.closable)
    .with(false, (): readonly OverlayPaint[] => [])
    .otherwise(() => drawClosableBox(hud, window));
