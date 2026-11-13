import { HUD_FRAME, HUD_TITLE_HEIGHT } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudWindow } from '../types/hud-window';

/**
 * The title bar, measured from the window's top-left pixel. Dragging it
 * moves the window.
 */
export const computeTitleRect = ({ width }: HudWindow): HudRect => ({
  row: HUD_FRAME,
  column: HUD_FRAME,
  width: width - 2 * HUD_FRAME,
  height: HUD_TITLE_HEIGHT,
});
