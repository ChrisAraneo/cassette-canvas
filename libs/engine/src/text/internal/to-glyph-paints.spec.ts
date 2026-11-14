import { filter, map, size, uniq } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { isPixel } from '../../palette/is-pixel';
import { TEXT_ASCENT } from '../consts';
import { measureText } from '../measure-text';
import type { TextPixels } from '../types/text-pixels';
import { toGlyphPaints } from './to-glyph-paints';

const { nonNullable } = P;

const INK = 0x15;

const OTHER_INK = 0x26;

const toColumns = (text: string): number[] =>
  map(toGlyphPaints(text, INK), (paint) => paint.column);

/** The pixel values each character of a line was drawn in. */
const toInks = (text: string, pixels: TextPixels): number[][] =>
  map(toGlyphPaints(text, pixels), (paint) =>
    match(paint)
      .with({ image: nonNullable }, ({ image }) =>
        uniq(filter(image.pixels, isPixel)),
      )
      .otherwise(() => []),
  );

describe('toGlyphPaints', () => {
  it('should return one step for every character it knows when it paints a text', () => {
    expect(size(toGlyphPaints('HI', INK))).toBe(2);
  });

  it('should return the first character at the left edge when it paints a text', () => {
    expect(toColumns('HI')[0]).toBe(0);
  });

  it('should return the next character moved on by the width of the one before when it paints a text', () => {
    expect(toColumns('HI')[1]).toBe(measureText('H'));
  });

  it('should return a gap when it does not know a character', () => {
    expect(toColumns('HéH')[1]).toBe(measureText('Hé'));
  });

  it('should return no steps when it does not know the character', () => {
    expect(size(toGlyphPaints('é', INK))).toBe(0);
  });

  it('should return a capital below the rows an accent needs when it paints one', () => {
    expect(toGlyphPaints('H', INK)[0]?.row).toBe(TEXT_ASCENT);
  });

  it('should return a row above the capitals when a mark sits high', () => {
    expect(toGlyphPaints('`', INK)[0]?.row).toBe(0);
  });

  it('should return no steps when the text is empty', () => {
    expect(toGlyphPaints('', INK)).toEqual([]);
  });

  it('should return every character in the same pixel when the line has one pixel', () => {
    expect(toInks('HI', INK)).toEqual([[INK], [INK]]);
  });

  it('should return each character in its own pixel when the line has a list', () => {
    expect(toInks('HI', [INK, OTHER_INK])).toEqual([[INK], [OTHER_INK]]);
  });

  it('should return the last pixel of the list for the characters past its end when the line has a short list', () => {
    expect(toInks('HIT', [INK, OTHER_INK])).toEqual([
      [INK],
      [OTHER_INK],
      [OTHER_INK],
    ]);
  });
});
