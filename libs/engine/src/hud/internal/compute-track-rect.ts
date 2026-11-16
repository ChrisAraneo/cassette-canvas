import { HUD_LIST_BAR_WIDTH } from '../consts';
import type { HudRect } from '../types/hud-rect';

export const computeTrackRect = (bar: HudRect): HudRect => ({
  ...bar,
  row: bar.row + HUD_LIST_BAR_WIDTH,
  height: bar.height - 2 * HUD_LIST_BAR_WIDTH,
});
