import type { HudFocus } from './hud-focus';
import type { HudGrab } from './hud-grab';
import type { HudTheme } from './hud-theme';
import type { HudWindow } from './hud-window';

/**
 * A HUD: its windows, the colors they are drawn in, and what the pointer
 * holds and the keyboard types into. Windows are listed from the bottom up,
 * so the last one is on top and a click finds it first.
 */
export interface Hud {
  readonly theme: HudTheme;
  readonly windows: readonly HudWindow[];
  readonly grab: HudGrab | undefined;
  readonly focus: HudFocus | undefined;
}
