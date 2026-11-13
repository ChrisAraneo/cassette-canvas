import { map } from 'lodash-es';
import { patchMatchingWindow } from './internal/patch-matching-window';
import type { Hud } from './types/hud';
import type { HudWindowChanges } from './types/hud-window-changes';

/**
 * Changes a window's title, place, size, color, close box, open page or
 * widgets. Fields you leave out keep their values. The window keeps its
 * place in the stack. Returns a new HUD. If no window has the id, nothing
 * changes.
 */
export const patchHudWindow = (
  hud: Hud,
  id: string,
  changes: HudWindowChanges,
): Hud => ({
  ...hud,
  windows: map(hud.windows, (window) =>
    patchMatchingWindow(window, id, changes),
  ),
});
