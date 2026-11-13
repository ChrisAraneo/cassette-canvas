import { flatMap } from 'lodash-es';
import { composeOverlay } from '../../overlay/compose-overlay';
import type { OverlayPlacement } from '../../overlay/types/overlay-placement';
import { HUD_OVERLAY_PREFIX } from '../consts';
import type { Hud } from '../types/hud';
import type { HudWindow } from '../types/hud-window';
import { filterPageWidgets } from './filter-page-widgets';
import { paintHudWidget } from './paint-hud-widget';
import { paintHudWindow } from './paint-hud-window';

/**
 * Paints one window, frame first and then the widgets of its open page, into
 * an overlay of its own size. Its id is the overlay prefix, a dash and the
 * window id.
 */
export const composeHudWindow = (
  hud: Hud,
  window: HudWindow,
): OverlayPlacement => ({
  id: `${HUD_OVERLAY_PREFIX}-${window.id}`,
  overlay: composeOverlay(window.width, window.height, [
    ...paintHudWindow(hud, window),
    ...flatMap(filterPageWidgets(window), (widget) =>
      paintHudWidget(hud, window, widget),
    ),
  ]),
  row: window.row,
  column: window.column,
});
