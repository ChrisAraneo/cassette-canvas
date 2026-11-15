import { constant } from 'lodash-es';
import { match } from 'ts-pattern';
import { filterOtherWindows } from './internal/filter-other-windows';
import type { Hud } from './types/hud';
import type { HudFocus } from './types/hud-focus';
import type { HudGrab } from './types/hud-grab';

const removeWindowGrab = (hud: Hud, window: string): HudGrab | undefined =>
  match(hud.grab)
    .with({ window }, constant(undefined))
    .otherwise(() => hud.grab);

const removeWindowFocus = (hud: Hud, window: string): HudFocus | undefined =>
  match(hud.focus)
    .with({ window }, constant(undefined))
    .otherwise(() => hud.focus);

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
