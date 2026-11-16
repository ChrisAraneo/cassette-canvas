import type { HudRect } from '../types/hud-rect';
import type { HudWindow } from '../types/hud-window';

export const toWindowRect = (window: HudWindow): HudRect => ({
  row: 0,
  column: 0,
  width: window.width,
  height: window.height,
});
