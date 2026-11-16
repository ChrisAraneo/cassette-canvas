import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeTextAdvance } from '../compute-text-advance';
import { TEXT_UNKNOWN_ADVANCE } from '../consts';
import { addGlyph } from './add-glyph';
import type { GlyphRun } from './types/glyph-run';

const INK = 0x15;

const createRun = (): GlyphRun => ({ column: 0, paints: [] });

describe('addGlyph', () => {
  it('should add one step when it knows the character', () => {
    expect(size(addGlyph(createRun(), 'H', INK, 0).paints)).toBe(1);
  });

  it('should move the pen on by the width of the character when it knows it', () => {
    expect(addGlyph(createRun(), 'H', INK, 0).column).toBe(
      computeTextAdvance('H'),
    );
  });

  it('should add no step when it does not know the character', () => {
    expect(size(addGlyph(createRun(), 'é', INK, 0).paints)).toBe(0);
  });

  it('should leave a gap when it does not know the character', () => {
    expect(addGlyph(createRun(), 'é', INK, 0).column).toBe(
      TEXT_UNKNOWN_ADVANCE,
    );
  });

  it('should add no step when the character is empty', () => {
    expect(size(addGlyph(createRun(), '', INK, 0).paints)).toBe(0);
  });

  it('should not change the run it was given when it adds a character', () => {
    const run = createRun();

    addGlyph(run, 'H', INK, 0);

    expect(run).toEqual(createRun());
  });
});
