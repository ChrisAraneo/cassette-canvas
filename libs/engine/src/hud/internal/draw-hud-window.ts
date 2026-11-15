import { flatMap } from 'lodash-es';
import { drawOverlay } from '../../overlay/draw-overlay';
import type { OverlayPlacement } from '../../screen/types/overlay-placement';
import { HUD_OVERLAY_PREFIX } from '../consts';
import type { Hud } from '../types/hud';
import type { HudWindow } from '../types/hud-window';
import { drawHudWidget } from './draw-hud-widget';
import { drawHudWindowFrame } from './draw-hud-window-frame';
import { toWindowWidgets } from './to-window-widgets';

/**
 * Paints one window, frame first and then the widgets of its open page, with
 * the widgets of a list's items over the list they sit on, into an overlay
 * of its own size. Its id is the overlay prefix, a dash, and the window id.
 */
export const drawHudWindow = (
  hud: Hud,
  window: HudWindow,
): OverlayPlacement => ({
  id: `${HUD_OVERLAY_PREFIX}-${window.id}`,
  overlay: drawOverlay(window.width, window.height, [
    ...drawHudWindowFrame(hud, window),
    ...flatMap(toWindowWidgets(window), (placed) =>
      drawHudWidget(hud, window, placed.widget),
    ),
  ]),
  row: window.row,
  column: window.column,
});
