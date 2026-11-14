import { composeOverlay } from '../overlay/compose-overlay';
import type { Overlay } from '../overlay/types/overlay';
import { TEXT_LINE_ROWS } from './consts';
import { toGlyphPaints } from './internal/to-glyph-paints';
import { measureText } from './measure-text';
import type { TextPixels } from './types/text-pixels';

/**
 * Draws a line of text as an overlay `TEXT_LINE_ROWS` tall and
 * `measureText(text)` wide. `pixels` is one pixel value for the whole line,
 * or one per character for a line of more than one color.
 *
 * Row `TEXT_ASCENT` is the top of a capital, and the baseline sits
 * `TEXT_HEIGHT` rows below that, so placing the overlay at
 * `row - TEXT_ASCENT` puts the top of a capital at `row`. Characters the
 * font does not know leave a gap.
 */
export const toTextOverlay = (text: string, pixels: TextPixels): Overlay =>
  composeOverlay(
    measureText(text),
    TEXT_LINE_ROWS,
    toGlyphPaints(text, pixels),
  );
