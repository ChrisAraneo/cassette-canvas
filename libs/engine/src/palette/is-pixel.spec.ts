import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from './consts';
import { isPixel } from './is-pixel';

describe('isPixel', () => {
  it('should accept the pixel when it names the first color and its darkest shade', () => {
    expect(isPixel(0x00)).toBe(true);
  });

  it('should accept the pixel when it names the last color and its lightest shade', () => {
    expect(isPixel(0xf7)).toBe(true);
  });

  it('should refuse the value when it is transparent', () => {
    expect(isPixel(TRANSPARENT)).toBe(false);
  });

  it('should refuse the value when its shade digit is past the last shade', () => {
    expect(isPixel(0x08)).toBe(false);
    expect(isPixel(0x2f)).toBe(false);
  });

  it('should refuse the value when its color is past the last color', () => {
    expect(isPixel(0x100)).toBe(false);
  });

  it('should refuse the value when it is a fraction', () => {
    expect(isPixel(1.5)).toBe(false);
  });
});
