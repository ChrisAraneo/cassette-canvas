import { HUD_PADDING } from '../consts';
import type { HudRect } from '../types/hud-rect';
import { computeCaretWidth } from './compute-caret-width';

export const computeFieldRoom = (rect: HudRect, focused: boolean): number =>
  rect.width - 2 * HUD_PADDING - computeCaretWidth(focused);
