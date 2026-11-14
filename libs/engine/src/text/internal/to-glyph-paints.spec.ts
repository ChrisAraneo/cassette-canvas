import { map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TEXT_ASCENT } from '../consts';
import { measureText } from '../measure-text';
import { toGlyphPaints } from './to-glyph-paints';

const INK = 0x15;

const toColumns = (text: string): number[] =>
  map(toGlyphPaints(text, INK), (paint) => paint.column);

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
});
