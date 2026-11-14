import { describe, expect, it } from 'vitest';

import { paintBevel } from './paint-bevel';

const BOX = Object.freeze({ row: 2, column: 3, width: 10, height: 6 });

describe('paintBevel', () => {
  it('should return the light along the top when it paints a bevel', () => {
    expect(paintBevel(BOX, 0x17, 0x13)[0]).toEqual({
      pixel: 0x17,
      row: 2,
      column: 3,
      width: 10,
      height: 1,
    });
  });

  it('should return the light down the left when it paints a bevel', () => {
    expect(paintBevel(BOX, 0x17, 0x13)[1]).toEqual({
      pixel: 0x17,
      row: 2,
      column: 3,
      width: 1,
      height: 6,
    });
  });

  it('should return the shadow along the bottom when it paints a bevel', () => {
    expect(paintBevel(BOX, 0x17, 0x13)[2]).toEqual({
      pixel: 0x13,
      row: 7,
      column: 3,
      width: 10,
      height: 1,
    });
  });

  it('should return the shadow down the right, over the corners, when it paints a bevel', () => {
    expect(paintBevel(BOX, 0x17, 0x13)[3]).toEqual({
      pixel: 0x13,
      row: 2,
      column: 12,
      width: 1,
      height: 6,
    });
  });

  it('should return four paint steps when it paints a bevel, so the corners come out right', () => {
    expect(paintBevel(BOX, 0x17, 0x13)).toHaveLength(4);
  });
});
