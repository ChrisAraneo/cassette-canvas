/**
 * The height of a capital letter, in logical pixels. The built-in font is
 * drawn for this size and looks best at it.
 */
export const TEXT_HEIGHT = 7;

/**
 * The rows an accent or a `$` can reach above the top of a capital. A line
 * of text starts this far above the row you place it at.
 */
export const TEXT_ASCENT = 2;

/** The rows a descender, such as the tail of a `g`, reaches below a capital. */
export const TEXT_DESCENT = 2;

/** The rows one line of text takes: the ascent, a capital, and the descent. */
export const TEXT_LINE_ROWS = TEXT_ASCENT + TEXT_HEIGHT + TEXT_DESCENT;

/** The transparent column each character leaves after itself. */
export const TEXT_GAP = 1;

/** How far the pen moves for a character the font does not know. */
export const TEXT_UNKNOWN_ADVANCE = 3;

/** The character that marks ink in the glyph art. */
export const TEXT_INK = '#';
