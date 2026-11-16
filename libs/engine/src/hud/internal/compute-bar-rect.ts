import { HUD_EDGE, HUD_LIST_BAR_WIDTH } from '../consts';
import type { HudRect } from '../types/hud-rect';

export const computeBarRect = (rect: HudRect): HudRect => ({
  row: rect.row + HUD_EDGE,
  column: rect.column + rect.width - HUD_EDGE - HUD_LIST_BAR_WIDTH,
  width: HUD_LIST_BAR_WIDTH,
  height: rect.height - 2 * HUD_EDGE,
});
