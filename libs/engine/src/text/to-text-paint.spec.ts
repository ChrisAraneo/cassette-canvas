import { describe, expect, it } from 'vitest';

import { TEXT_ASCENT } from './consts';
import { toTextOverlay } from './to-text-overlay';
import { toTextPaint } from './to-text-paint';

const INK = 0x15;

const createInks = (): number[] => [0x15, 0x16];

const TEXT_ROW = 10;

const TEXT_COLUMN = 20;

describe('toTextPaint', () => {
  it('should return the line lifted when it paints a text, so the capitals start at the row', () => {
    expect(toTextPaint('HI', INK, TEXT_ROW, TEXT_COLUMN)).toEqual({
      image: toTextOverlay('HI', INK),
      row: TEXT_ROW - TEXT_ASCENT,
      column: TEXT_COLUMN,
    });
  });

  it('should return the text starting at the column it is given when it paints one', () => {
    expect(toTextPaint('HI', INK, 0, TEXT_COLUMN).column).toBe(TEXT_COLUMN);
  });

  it('should not change the old pixels when it paints a text', () => {
    const inks = createInks();

    toTextPaint('HI', inks, TEXT_ROW, TEXT_COLUMN);

    expect(inks).toEqual(createInks());
  });

  it('should return an empty image when the text is empty', () => {
    expect(toTextPaint('', INK, TEXT_ROW, TEXT_COLUMN)).toEqual({
      image: toTextOverlay('', INK),
      row: TEXT_ROW - TEXT_ASCENT,
      column: TEXT_COLUMN,
    });
  });
});
