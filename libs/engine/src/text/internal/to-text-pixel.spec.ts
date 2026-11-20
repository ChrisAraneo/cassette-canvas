import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import { toTextPixel } from './to-text-pixel';

const INK = 0x15;

const OTHER_INK = 0x26;

const THIRD_INK = 0x37;

describe('toTextPixel', () => {
  it('should return the same pixel for every character when the line has one pixel', () => {
    expect([toTextPixel(INK, 0), toTextPixel(INK, 7)]).toEqual([INK, INK]);
  });

  it('should return the pixel at the place of the character when the line has a list', () => {
    expect(toTextPixel([INK, OTHER_INK, THIRD_INK], 1)).toBe(OTHER_INK);
  });

  it('should return the last pixel of the list when the character is past its end', () => {
    expect(toTextPixel([INK, OTHER_INK], 5)).toBe(OTHER_INK);
  });

  it('should return a transparent pixel when the list is empty', () => {
    expect(toTextPixel([], 0)).toBe(TRANSPARENT);
  });
});
