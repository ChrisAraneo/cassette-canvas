import { describe, expect, it } from 'vitest';

import { TEXT_UNKNOWN_ADVANCE } from '../consts';
import { toSkippedRun } from './to-skipped-run';
import type { GlyphRun } from './types/glyph-run';

const PAINTS = Object.freeze([
  { pixel: 0x15, row: 0, column: 0, width: 1, height: 1 },
]);

const createRun = (): GlyphRun => ({ column: 4, paints: PAINTS });

describe('toSkippedRun', () => {
  it('should move the pen on by the width of an unknown character when it skips one', () => {
    expect(toSkippedRun(createRun()).column).toBe(4 + TEXT_UNKNOWN_ADVANCE);
  });

  it('should pass the steps on when it skips a character', () => {
    expect(toSkippedRun(createRun()).paints).toBe(PAINTS);
  });

  it('should pass no steps on when the line has painted nothing yet', () => {
    expect(toSkippedRun({ column: 0, paints: [] }).paints).toEqual([]);
  });

  it('should not change the run it was given when it skips a character', () => {
    const run = createRun();

    toSkippedRun(run);

    expect(run).toEqual(createRun());
  });
});
