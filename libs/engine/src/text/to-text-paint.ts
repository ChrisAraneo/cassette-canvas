import type { OverlayPaint } from '../overlay/types/overlay-paint';
import { TEXT_ASCENT } from './consts';
import { toTextOverlay } from './to-text-overlay';
import type { TextPixels } from './types/text-pixels';

/**
 * Returns a paint step that draws a line of text, with the top of a capital
 * at `row` and its first character at `column`. `pixels` is one pixel value
 * for the whole line, or one per character for a line of more than one
 * color. Use it with `composeOverlay`.
 */
export const toTextPaint = (
  text: string,
  pixels: TextPixels,
  row: number,
  column: number,
): OverlayPaint => ({
  image: toTextOverlay(text, pixels),
  row: row - TEXT_ASCENT,
  column,
});
