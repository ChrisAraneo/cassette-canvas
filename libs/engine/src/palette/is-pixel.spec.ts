import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from './consts';
import { isPixel } from './is-pixel';

describe('isPixel', () => {
  it('should return true when the pixel names the first color and its darkest shade', () => {
    expect(isPixel(0x00)).toBe(true);
  });

  it('should return true when the pixel names the last color and its lightest shade', () => {
    expect(isPixel(0xf7)).toBe(true);
  });

  it('should return false when the value is transparent', () => {
    expect(isPixel(TRANSPARENT)).toBe(false);
  });

  it('should return false when the shade digit is past the last shade', () => {
    expect(isPixel(0x08)).toBe(false);
    expect(isPixel(0x2f)).toBe(false);
  });

  it('should return false when the color is past the last color', () => {
    expect(isPixel(0x100)).toBe(false);
  });

  it('should return false when the value is a fraction', () => {
    expect(isPixel(1.5)).toBe(false);
  });
});
