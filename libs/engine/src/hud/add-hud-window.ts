import { filterOtherWindows } from './internal/filter-other-windows';
import { toHudWindow } from './internal/to-hud-window';
import type { Hud } from './types/hud';
import type { HudWindowSettings } from './types/hud-window-settings';

/**
 * Adds a window on top of the others. If a window with the same id is there,
 * it is removed first. Returns a new HUD.
 */
export const addHudWindow = (hud: Hud, settings: HudWindowSettings): Hud => ({
  ...hud,
  windows: [
    ...filterOtherWindows(hud.windows, settings.id),
    toHudWindow(hud, settings),
  ],
});
