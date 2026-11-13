import { reduce, split } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { TEXT_ASCENT, TEXT_UNKNOWN_ADVANCE } from '../consts';
import { GLYPHS } from './glyphs';
import { toGlyphOverlay } from './to-glyph-overlay';

const { nonNullable } = P;

interface GlyphRun {
  readonly column: number;
  readonly paints: readonly OverlayPaint[];
}

const START: GlyphRun = Object.freeze({ column: 0, paints: [] });

const addGlyph = (run: GlyphRun, character: string, pixel: number): GlyphRun =>
  match(GLYPHS[character])
    .with(nonNullable, (glyph) => ({
      column: run.column + glyph.advance,
      paints: [
        ...run.paints,
        {
          image: toGlyphOverlay(glyph, pixel),
          row: TEXT_ASCENT + glyph.top,
          column: run.column,
        },
      ],
    }))
    .otherwise(() => ({
      column: run.column + TEXT_UNKNOWN_ADVANCE,
      paints: run.paints,
    }));

/**
 * Lays a line of text out as paint steps, one per character the font knows,
 * placed from left to right. Row 0 is where an accent can reach, so the top
 * of a capital is row `TEXT_ASCENT`.
 */
export const toGlyphPaints = (
  text: string,
  pixel: number,
): readonly OverlayPaint[] =>
  reduce(
    split(text, ''),
    (run: GlyphRun, character: string) => addGlyph(run, character, pixel),
    START,
  ).paints;
