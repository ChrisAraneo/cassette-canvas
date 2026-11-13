import { describe, expect, it } from 'vitest';

import { paintBevel } from './paint-bevel';

const BOX = Object.freeze({ row: 2, column: 3, width: 10, height: 6 });

describe('paintBevel', () => {
  it('should run the light along the top', () => {
    expect(paintBevel(BOX, 0x17, 0x13)[0]).toEqual({
      pixel: 0x17,
      row: 2,
      column: 3,
      width: 10,
      height: 1,
    });
  });

  it('should run the light down the left', () => {
    expect(paintBevel(BOX, 0x17, 0x13)[1]).toEqual({
      pixel: 0x17,
      row: 2,
      column: 3,
      width: 1,
      height: 6,
    });
  });

  it('should run the shadow along the bottom', () => {
    expect(paintBevel(BOX, 0x17, 0x13)[2]).toEqual({
      pixel: 0x13,
      row: 7,
      column: 3,
      width: 10,
      height: 1,
    });
  });

  it('should run the shadow down the right, over the corners', () => {
    expect(paintBevel(BOX, 0x17, 0x13)[3]).toEqual({
      pixel: 0x13,
      row: 2,
      column: 12,
      width: 1,
      height: 6,
    });
  });

  it('should take four steps, so the corners come out right', () => {
    expect(paintBevel(BOX, 0x17, 0x13)).toHaveLength(4);
  });
});
