import {
  DEFAULT_HUD_COLOR,
  HUD_BODY_SHADE,
  HUD_EDGE_SHADE,
  HUD_FACE_SHADE,
  HUD_HIGHLIGHT_SHADE,
  HUD_SHADOW_SHADE,
  HUD_TEXT_SHADE,
  HUD_TITLE_SHADE,
} from './consts';
import type { HudTheme } from './types/hud-theme';

/**
 * Returns the shades a HUD is drawn in, on one base color. The default is
 * `DEFAULT_HUD_COLOR`. Pass another palette color to move the whole HUD onto
 * it, or change single shades afterwards:
 * `{ ...createHudTheme(), text: 0 }`.
 */
export const createHudTheme = (
  color: number = DEFAULT_HUD_COLOR,
): HudTheme => ({
  color,
  edge: HUD_EDGE_SHADE,
  shadow: HUD_SHADOW_SHADE,
  title: HUD_TITLE_SHADE,
  body: HUD_BODY_SHADE,
  face: HUD_FACE_SHADE,
  highlight: HUD_HIGHLIGHT_SHADE,
  text: HUD_TEXT_SHADE,
});
