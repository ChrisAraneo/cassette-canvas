import { map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TEXT_ASCENT } from '../consts';
import { measureText } from '../measure-text';
import { toGlyphPaints } from './to-glyph-paints';

const INK = 0x15;

const toColumns = (text: string): number[] =>
  map(toGlyphPaints(text, INK), (paint) => paint.column);

describe('toGlyphPaints', () => {
  it('should give one step for every character it knows', () => {
    expect(size(toGlyphPaints('HI', INK))).toBe(2);
  });

  it('should start the first character at the left edge', () => {
    expect(toColumns('HI')[0]).toBe(0);
  });

  it('should move the pen on by the width of the character before', () => {
    expect(toColumns('HI')[1]).toBe(measureText('H'));
  });

  it('should leave a gap for a character it does not know', () => {
    expect(toColumns('HéH')[1]).toBe(measureText('Hé'));
  });

  it('should draw nothing for a character it does not know', () => {
    expect(size(toGlyphPaints('é', INK))).toBe(0);
  });

  it('should put a capital below the rows an accent needs', () => {
    expect(toGlyphPaints('H', INK)[0]?.row).toBe(TEXT_ASCENT);
  });

  it('should reach above the capitals for a mark that sits high', () => {
    expect(toGlyphPaints('`', INK)[0]?.row).toBe(0);
  });

  it('should give no steps for an empty text', () => {
    expect(toGlyphPaints('', INK)).toEqual([]);
  });
});
