import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from './consts';
import { toPixel } from './to-pixel';

describe('toPixel', () => {
  it('should return the color in the high digit and the shade in the low one when both are in range', () => {
    expect(toPixel(3, 5)).toBe(0x35);
  });

  it('should return the first and the last pixel when it gets the first and the last color', () => {
    expect(toPixel(0, 0)).toBe(0x00);
    expect(toPixel(15, 7)).toBe(0xf7);
  });

  it('should return a transparent pixel when the color is past the last color', () => {
    expect(toPixel(16, 0)).toBe(TRANSPARENT);
  });

  it('should return a transparent pixel when the shade is past the last shade', () => {
    expect(toPixel(2, 8)).toBe(TRANSPARENT);
  });

  it('should return a transparent pixel when the color or the shade is negative', () => {
    expect(toPixel(-1, 0)).toBe(TRANSPARENT);
    expect(toPixel(2, -16)).toBe(TRANSPARENT);
  });

  it('should return a transparent pixel when the shade is a fraction', () => {
    expect(toPixel(2, 0.5)).toBe(TRANSPARENT);
  });
});
