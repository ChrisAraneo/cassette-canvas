import type { HudFocus } from './hud-focus';
import type { HudGrab } from './hud-grab';
import type { HudSize } from './hud-size';
import type { HudTheme } from './hud-theme';
import type { HudWindow } from './hud-window';

/**
 * A HUD: its windows, the colors they are drawn in, the screen they are on,
 * and what the pointer holds and the keyboard types into. Windows are listed
 * from the bottom up, so the last one is on top and a click finds it first.
 *
 * `size` is the screen in logical pixels, which no window can be dragged
 * past. A HUD without one lets its windows go anywhere.
 */
export interface Hud {
  readonly theme: HudTheme;
  readonly size: HudSize | undefined;
  readonly windows: readonly HudWindow[];
  readonly grab: HudGrab | undefined;
  readonly focus: HudFocus | undefined;
}
