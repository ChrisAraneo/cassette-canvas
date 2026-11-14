import { describe, expect, it } from 'vitest';

import { insetRect } from './inset-rect';

const BOX = Object.freeze({ row: 0, column: 0, width: 10, height: 8 });

describe('insetRect', () => {
  it('should return the corner moved in and the amount taken off both sides when it insets a rectangle', () => {
    expect(insetRect(BOX, 1)).toEqual({
      row: 1,
      column: 1,
      width: 8,
      height: 6,
    });
  });

  it('should return the same rectangle when the inset is 0', () => {
    expect(insetRect(BOX, 0)).toEqual(BOX);
  });
});
