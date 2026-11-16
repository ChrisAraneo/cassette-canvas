import { reduce, split } from 'lodash-es';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import type { TextPixels } from '../types/text-pixels';
import { addGlyph } from './add-glyph';
import type { GlyphRun } from './types/glyph-run';

const START: GlyphRun = Object.freeze({ column: 0, paints: [] });

/**
 * Lays a line of text out as paint steps, one per character the font knows,
 * placed from left to right. Row 0 is where an accent can reach, so the top
 * of a capital is row `TEXT_ASCENT`. Each character takes its own pixel
 * value from `pixels`, so a line can hold more than one color.
 */
export const toGlyphPaints = (
  text: string,
  pixels: TextPixels,
): readonly OverlayPaint[] =>
  reduce(
    split(text, ''),
    (run: GlyphRun, character: string, index: number) =>
      addGlyph(run, character, pixels, index),
    START,
  ).paints;
