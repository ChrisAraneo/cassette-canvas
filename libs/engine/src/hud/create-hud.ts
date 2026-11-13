import { DEFAULT_HUD_COLOR } from './consts';
import { createHudTheme } from './create-hud-theme';
import type { Hud } from './types/hud';

/**
 * Creates a HUD with no windows, drawn in shades of one palette color. The
 * default is `DEFAULT_HUD_COLOR`. To change single shades, replace the
 * theme: `{ ...createHud(), theme: { ...createHudTheme(), text: 0 } }`.
 */
export const createHud = (color: number = DEFAULT_HUD_COLOR): Hud => ({
  theme: createHudTheme(color),
  windows: [],
  grab: undefined,
  focus: undefined,
});
