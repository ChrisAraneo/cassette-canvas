import { HUD_EDGE, HUD_LIST_BAR_WIDTH, HUD_PADDING } from '../consts';
import type { HudRect } from '../types/hud-rect';

export const computeItemWidth = (rect: HudRect): number =>
  rect.width - HUD_PADDING - HUD_EDGE - HUD_LIST_BAR_WIDTH;
