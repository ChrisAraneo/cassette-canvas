import { describe, expect, it } from 'vitest';

import { toFraction } from './to-fraction';

describe('toFraction', () => {
  it('should return the part after the decimal point when the number is positive', () => {
    expect(toFraction(2.25)).toBe(0.25);
  });

  it('should return the part above the whole number below when the number is negative', () => {
    expect(toFraction(-0.25)).toBe(0.75);
  });

  it('should return zero when the number is whole', () => {
    expect(toFraction(3)).toBe(0);
  });
});
