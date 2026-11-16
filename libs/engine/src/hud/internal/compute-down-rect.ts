import { HUD_LIST_BAR_WIDTH } from '../consts';
import type { HudRect } from '../types/hud-rect';

export const computeDownRect = (bar: HudRect): HudRect => ({
  ...bar,
  row: bar.row + bar.height - HUD_LIST_BAR_WIDTH,
  height: HUD_LIST_BAR_WIDTH,
});
