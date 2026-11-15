import type { Screen } from '../screen/types/screen';
import { drawHud } from './draw-hud';
import type { Hud } from './types/hud';

/**
 * Puts the HUD's windows on the screen as overlays, over everything light
 * touches and over any overlay already there. Returns a new screen.
 */
export const addHud = (screen: Screen, hud: Hud): Screen => ({
  ...screen,
  overlays: [...screen.overlays, ...drawHud(hud)],
});
