import { describe, expect, it } from 'vitest';

import { insetRect } from './inset-rect';

const BOX = Object.freeze({ row: 0, column: 0, width: 10, height: 8 });

describe('insetRect', () => {
  it('should move the corner in and take the amount off both sides', () => {
    expect(insetRect(BOX, 1)).toEqual({
      row: 1,
      column: 1,
      width: 8,
      height: 6,
    });
  });

  it('should give back the same rectangle for no inset', () => {
    expect(insetRect(BOX, 0)).toEqual(BOX);
  });
});
