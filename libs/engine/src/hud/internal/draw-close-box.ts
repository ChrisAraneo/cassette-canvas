import { match } from 'ts-pattern';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import type { Hud } from '../types/hud';
import type { HudWindow } from '../types/hud-window';
import { drawClosableBox } from './draw-closable-box';

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
