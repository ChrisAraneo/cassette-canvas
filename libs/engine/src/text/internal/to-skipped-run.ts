import { TEXT_UNKNOWN_ADVANCE } from '../consts';
import type { GlyphRun } from './types/glyph-run';

export const toSkippedRun = (run: GlyphRun): GlyphRun => ({
  column: run.column + TEXT_UNKNOWN_ADVANCE,
  paints: run.paints,
});
