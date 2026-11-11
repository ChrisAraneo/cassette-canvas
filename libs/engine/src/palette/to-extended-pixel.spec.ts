import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from './consts';
import { toExtendedPixel } from './to-extended-pixel';

describe('toExtendedPixel', () => {
  it('should give each color its own run of 32 extended shades', () => {
    expect(toExtendedPixel(3, 21)).toBe(3 * 32 + 21);
  });

  it('should give the first and the last extended pixel when it gets the first and the last color', () => {
    expect(toExtendedPixel(0, 0)).toBe(0);
    expect(toExtendedPixel(15, 31)).toBe(511);
  });

  it('should give a transparent pixel when the color is past the last color', () => {
    expect(toExtendedPixel(16, 0)).toBe(TRANSPARENT);
  });

  it('should give a transparent pixel when the extended shade is past the last one', () => {
    expect(toExtendedPixel(2, 32)).toBe(TRANSPARENT);
  });

  it('should give a transparent pixel when the color or the extended shade is negative', () => {
    expect(toExtendedPixel(-1, 0)).toBe(TRANSPARENT);
    expect(toExtendedPixel(2, -1)).toBe(TRANSPARENT);
  });

  it('should give a transparent pixel when the extended shade is a fraction', () => {
    expect(toExtendedPixel(2, 0.5)).toBe(TRANSPARENT);
  });
});
