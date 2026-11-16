import { describe, expect, it } from 'vitest';

import { toCount } from './to-count';

const PIXELS = 3;

describe('toCount', () => {
  it('should return the number it was given when it counts whole pixels', () => {
    expect(toCount(PIXELS)).toBe(PIXELS);
  });

  it('should return the whole pixels only when the number falls between two', () => {
    expect(toCount(PIXELS + 0.75)).toBe(PIXELS);
  });

  it('should return no pixels when the number is below none', () => {
    expect(toCount(-PIXELS)).toBe(0);
  });

  it('should return no pixels when the number is none', () => {
    expect(toCount(0)).toBe(0);
  });
});
