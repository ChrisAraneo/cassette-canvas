import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TEXT_ASCENT } from '../consts';
import { toDrawnRun } from './to-drawn-run';
import type { Glyph } from './types/glyph';
import type { GlyphRun } from './types/glyph-run';

const INK = 0x15;

const OTHER_INK = 0x26;

const GLYPH: Glyph = Object.freeze({
  advance: 4,
  top: 0,
  rows: Object.freeze(['##', '##']),
});

const HIGH_GLYPH: Glyph = Object.freeze({
  advance: 3,
  top: -2,
  rows: Object.freeze(['#']),
});

const createRun = (): GlyphRun => ({ column: 4, paints: [] });

describe('toDrawnRun', () => {
  it('should move the pen on by the width of the character when it draws one', () => {
    expect(toDrawnRun(createRun(), GLYPH, INK, 0).column).toBe(8);
  });

  it('should place the character where the pen stands when it draws one', () => {
    expect(toDrawnRun(createRun(), GLYPH, INK, 0).paints[0]?.column).toBe(4);
  });

  it('should place a capital below the rows an accent needs when it draws one', () => {
    expect(toDrawnRun(createRun(), GLYPH, INK, 0).paints[0]?.row).toBe(
      TEXT_ASCENT,
    );
  });

  it('should place a mark that sits high above the capitals when it draws one', () => {
    expect(toDrawnRun(createRun(), HIGH_GLYPH, INK, 0).paints[0]?.row).toBe(0);
  });

  it('should add one step to the ones the line already holds when it draws a character', () => {
    expect(
      size(
        toDrawnRun(toDrawnRun(createRun(), GLYPH, INK, 0), GLYPH, INK, 1)
          .paints,
      ),
    ).toBe(2);
  });

  it('should draw the character in the pixel of its place when the line has a list', () => {
    expect(
      toDrawnRun(createRun(), GLYPH, [INK, OTHER_INK], 1).paints[0],
    ).toEqual(toDrawnRun(createRun(), GLYPH, OTHER_INK, 0).paints[0]);
  });

  it('should not change the run it was given when it draws a character', () => {
    const run = createRun();

    toDrawnRun(run, GLYPH, INK, 0);

    expect(run).toEqual(createRun());
  });
});
