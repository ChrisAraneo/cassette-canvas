import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { computeTextAdvance } from '../../text/compute-text-advance';
import {
  HUD_CARET_HEIGHT,
  HUD_CARET_WIDTH,
  HUD_PADDING,
  HUD_TEXT_TOP,
} from '../consts';
import type { HudRect } from '../types/hud-rect';
import { computeCaretPixel } from './compute-caret-pixel';

export const drawCaret = (
  rect: HudRect,
  shown: string,
  text: number,
  focused: boolean,
): OverlayPaint => ({
  pixel: computeCaretPixel(text, focused),
  row: rect.row + HUD_TEXT_TOP,
  column: rect.column + HUD_PADDING + computeTextAdvance(shown),
  width: HUD_CARET_WIDTH,
  height: HUD_CARET_HEIGHT,
});
