import { describe, expect, it } from 'vitest';

import { BLACK } from '../consts';
import { toRgb } from './to-rgb';

describe('toRgb', () => {
  it('should return the three channels when the color is a full hex color', () => {
    expect(toRgb('#3c56c8')).toEqual({ red: 60, green: 86, blue: 200 });
  });

  it('should return black when the color is too short', () => {
    expect(toRgb('#12345')).toBe(BLACK);
  });

  it('should return black when the color is too long', () => {
    expect(toRgb('#1234567')).toBe(BLACK);
  });

  it('should return black when the color holds letters that are not hex digits', () => {
    expect(toRgb('#gg0000')).toBe(BLACK);
  });
});
