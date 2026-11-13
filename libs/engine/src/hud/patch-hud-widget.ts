import { map } from 'lodash-es';
import { patchWindowWidgets } from './internal/patch-window-widgets';
import type { Hud } from './types/hud';
import type { HudWidgetChanges } from './types/hud-widget-changes';

/**
 * Changes a widget of a window: the text of a label, a button or a field,
 * the width of a button or a field, or the tabs of a strip. Use it to show
 * numbers that move, such as a frame rate, without rebuilding the window.
 * Returns a new HUD. If neither the window nor the widget is there, nothing
 * changes.
 */
export const patchHudWidget = (
  hud: Hud,
  window: string,
  widget: string,
  changes: HudWidgetChanges,
): Hud => ({
  ...hud,
  windows: map(hud.windows, (placed) =>
    patchWindowWidgets(placed, window, widget, changes),
  ),
});
