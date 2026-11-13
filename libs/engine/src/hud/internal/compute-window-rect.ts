import type { HudRect } from '../types/hud-rect';
import type { HudWindow } from '../types/hud-window';

/** Returns where a window sits on the screen. */
export const computeWindowRect = ({
  row,
  column,
  width,
  height,
}: HudWindow): HudRect => ({ row, column, width, height });
