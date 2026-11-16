import { TEXT_ASCENT } from '../consts';
import type { TextPixels } from '../types/text-pixels';
import { toGlyphOverlay } from './to-glyph-overlay';
import { toTextPixel } from './to-text-pixel';
import type { Glyph } from './types/glyph';
import type { GlyphRun } from './types/glyph-run';

export const toDrawnRun = (
  run: GlyphRun,
  glyph: Glyph,
  pixels: TextPixels,
  index: number,
): GlyphRun => ({
  column: run.column + glyph.advance,
  paints: [
    ...run.paints,
    {
      image: toGlyphOverlay(glyph, toTextPixel(pixels, index)),
      row: TEXT_ASCENT + glyph.top,
      column: run.column,
    },
  ],
});
