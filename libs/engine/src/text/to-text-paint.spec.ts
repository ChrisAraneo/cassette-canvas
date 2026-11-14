import { describe, expect, it } from 'vitest';

import { TEXT_ASCENT } from './consts';
import { toTextOverlay } from './to-text-overlay';
import { toTextPaint } from './to-text-paint';

describe('toTextPaint', () => {
  it('should return the line lifted when it paints a text, so the capitals start at the row', () => {
    expect(toTextPaint('HI', 0x15, 10, 20)).toEqual({
      image: toTextOverlay('HI', 0x15),
      row: 10 - TEXT_ASCENT,
      column: 20,
    });
  });

  it('should return the text starting at the column it is given when it paints one', () => {
    expect(toTextPaint('HI', 0x15, 0, 7).column).toBe(7);
  });
});
