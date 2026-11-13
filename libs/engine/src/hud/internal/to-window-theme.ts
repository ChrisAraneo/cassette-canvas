import type { Hud } from '../types/hud';
import type { HudTheme } from '../types/hud-theme';
import type { HudWindow } from '../types/hud-window';

/** Returns the HUD's theme in the window's own color. */
export const toWindowTheme = (hud: Hud, window: HudWindow): HudTheme => ({
  ...hud.theme,
  color: window.color,
});
