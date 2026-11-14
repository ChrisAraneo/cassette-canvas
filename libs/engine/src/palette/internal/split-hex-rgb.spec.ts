import { describe, expect, it } from 'vitest';

import { splitHexRgb } from './split-hex-rgb';

describe('splitHexRgb', () => {
  it('should return each pair of digits as one channel when the color is written in hex', () => {
    expect(splitHexRgb('#ff8000')).toEqual({ red: 255, green: 128, blue: 0 });
  });

  it('should return the same channels when the digits mix upper and lower case', () => {
    expect(splitHexRgb('#A0b1C2')).toEqual({ red: 160, green: 177, blue: 194 });
  });

  it('should return black when the text holds no digits', () => {
    expect(splitHexRgb('')).toEqual({ red: 0, green: 0, blue: 0 });
  });
});
