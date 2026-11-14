import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import { toTextPixel } from './to-text-pixel';

describe('toTextPixel', () => {
  it('should return the same pixel for every character when the line has one pixel', () => {
    expect([toTextPixel(0x15, 0), toTextPixel(0x15, 7)]).toEqual([0x15, 0x15]);
  });

  it('should return the pixel at the place of the character when the line has a list', () => {
    expect(toTextPixel([0x15, 0x26, 0x37], 1)).toBe(0x26);
  });

  it('should return the last pixel of the list when the character is past its end', () => {
    expect(toTextPixel([0x15, 0x26], 5)).toBe(0x26);
  });

  it('should return a transparent pixel when the list is empty', () => {
    expect(toTextPixel([], 0)).toBe(TRANSPARENT);
  });
});
