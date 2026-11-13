import { toOverlay } from '../../overlay/to-overlay';
import type { Overlay } from '../../overlay/types/overlay';
import { TEXT_INK } from '../consts';
import type { Glyph } from './types/glyph';

/** Draws one glyph in one pixel value, as tall and wide as its art. */
export const toGlyphOverlay = (glyph: Glyph, pixel: number): Overlay =>
  toOverlay(glyph.rows, { [TEXT_INK]: pixel });
