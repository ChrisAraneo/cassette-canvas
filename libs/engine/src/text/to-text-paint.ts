import type { OverlayPaint } from '../overlay/types/overlay-paint';
import { TEXT_ASCENT } from './consts';
import { toTextOverlay } from './to-text-overlay';

/**
 * A paint step that draws a line of text in one pixel value, with the top of
 * a capital at `row` and its first character at `column`. Use it with
 * `composeOverlay`.
 */
export const toTextPaint = (
  text: string,
  pixel: number,
  row: number,
  column: number,
): OverlayPaint => ({
  image: toTextOverlay(text, pixel),
  row: row - TEXT_ASCENT,
  column,
});
