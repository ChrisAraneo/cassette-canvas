import { match, P } from 'ts-pattern';
import type { TextPixels } from '../types/text-pixels';
import { GLYPHS } from './glyphs';
import { toDrawnRun } from './to-drawn-run';
import { toSkippedRun } from './to-skipped-run';
import type { GlyphRun } from './types/glyph-run';

const { nonNullable } = P;

export const addGlyph = (
  run: GlyphRun,
  character: string,
  pixels: TextPixels,
  index: number,
): GlyphRun =>
  match(GLYPHS[character])
    .with(nonNullable, (glyph) => toDrawnRun(run, glyph, pixels, index))
    .otherwise(() => toSkippedRun(run));
