import { HUD_CONTENT_LEFT } from '../consts';
import type { HudWindow } from '../types/hud-window';

/** Returns how many columns a window leaves for its widgets. */
export const computeContentWidth = ({ width }: HudWindow): number =>
  Math.max(0, width - 2 * HUD_CONTENT_LEFT);
