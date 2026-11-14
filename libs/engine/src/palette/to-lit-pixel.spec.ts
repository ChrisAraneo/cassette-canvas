import { describe, expect, it } from 'vitest';

import { EXTENDED_SHADES_PER_SHADE, TRANSPARENT } from './consts';
import { toExtendedPixel } from './to-extended-pixel';
import { toLitPixel } from './to-lit-pixel';

describe('toLitPixel', () => {
  it('should return the pixel as authored when no light reaches it', () => {
    expect(toLitPixel(0x34, 0)).toBe(toExtendedPixel(3, 17));
  });

  it('should return a darker pixel in extended shades when the offset is negative', () => {
    expect(toLitPixel(0x34, -2)).toBe(toExtendedPixel(3, 15));
  });

  it('should return a lighter pixel in extended shades when the offset is positive', () => {
    expect(toLitPixel(0x34, 3)).toBe(toExtendedPixel(3, 20));
  });

  it('should return the next sprite shade when it moves four extended shades', () => {
    expect(toLitPixel(0x34, -EXTENDED_SHADES_PER_SHADE)).toBe(
      toLitPixel(0x33, 0),
    );
  });

  it('should return a shade below the darkest sprite shade when it is darkened', () => {
    expect(toLitPixel(0x30, -1)).toBe(toExtendedPixel(3, 0));
  });

  it('should return a shade above the lightest sprite shade when it is lightened', () => {
    expect(toLitPixel(0x37, 2)).toBe(toExtendedPixel(3, 31));
  });

  it('should return the darkest extended shade when the offset goes past it', () => {
    expect(toLitPixel(0x31, -40)).toBe(toExtendedPixel(3, 0));
  });

  it('should return the lightest extended shade when the offset goes past it', () => {
    expect(toLitPixel(0x36, 40)).toBe(toExtendedPixel(3, 31));
  });

  it('should return the offset rounded to whole extended shades when it is a fraction', () => {
    expect(toLitPixel(0x34, 1.6)).toBe(toExtendedPixel(3, 19));
    expect(toLitPixel(0x34, -1.4)).toBe(toExtendedPixel(3, 16));
  });

  it('should return the same color when it moves the shade', () => {
    expect(toLitPixel(0xf4, -4)).toBe(toExtendedPixel(15, 13));
  });

  it('should return a transparent pixel when the value is transparent', () => {
    expect(toLitPixel(TRANSPARENT, 3)).toBe(TRANSPARENT);
  });

  it('should return a transparent pixel when the value is not a pixel', () => {
    expect(toLitPixel(0x0a, -3)).toBe(TRANSPARENT);
  });
});
