import { DEFAULT_HUD_COLOR } from './consts';
import { createHudTheme } from './create-hud-theme';
import type { Hud } from './types/hud';
import type { HudSize } from './types/hud-size';

/**
 * Creates a HUD with no windows, drawn in shades of one palette color. The
 * default is `DEFAULT_HUD_COLOR`. To change single shades, replace the
 * theme: `{ ...createHud(), theme: { ...createHudTheme(), text: 0 } }`.
 *
 * `size` is the screen the HUD is on, in logical pixels, which is a
 * display's `width` and `height`. Windows cannot be dragged past its edges.
 * A HUD created without it lets them go anywhere.
 */
export const createHud = (
  color: number = DEFAULT_HUD_COLOR,
  size: HudSize | undefined = undefined,
): Hud => ({
  theme: createHudTheme(color),
  size,
  windows: [],
  grab: undefined,
  focus: undefined,
});
