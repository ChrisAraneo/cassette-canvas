import { filterOtherWindows } from './internal/filter-other-windows';
import { removeWindowFocus } from './internal/remove-window-focus';
import { removeWindowGrab } from './internal/remove-window-grab';
import type { Hud } from './types/hud';

/**
 * Removes the window with the id, and drops any grab or focus on it.
 * Returns a new HUD.
 */
export const removeHudWindow = (hud: Hud, id: string): Hud => ({
  ...hud,
  windows: filterOtherWindows(hud.windows, id),
  grab: removeWindowGrab(hud, id),
  focus: removeWindowFocus(hud, id),
});
