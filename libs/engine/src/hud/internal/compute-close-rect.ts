import { HUD_CLOSE_MARGIN, HUD_CLOSE_SIZE, HUD_FRAME } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudWindow } from '../types/hud-window';

/**
 * The close box at the right end of the title bar, measured from the
 * window's top-left pixel.
 */
export const computeCloseRect = ({ width }: HudWindow): HudRect => ({
  row: HUD_FRAME + HUD_CLOSE_MARGIN,
  column: width - HUD_FRAME - HUD_CLOSE_MARGIN - HUD_CLOSE_SIZE,
  width: HUD_CLOSE_SIZE,
  height: HUD_CLOSE_SIZE,
});
