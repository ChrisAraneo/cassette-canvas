import { HUD_LIST_BAR_WIDTH } from '../consts';
import type { HudRect } from '../types/hud-rect';

export const computeUpRect = (bar: HudRect): HudRect => ({
  ...bar,
  height: HUD_LIST_BAR_WIDTH,
});
