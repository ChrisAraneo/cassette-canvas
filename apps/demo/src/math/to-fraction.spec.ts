import { describe, expect, it } from 'vitest';

import { toFraction } from './to-fraction';

describe('toFraction', () => {
  it('should keep the part after the decimal point when the number is positive', () => {
    expect(toFraction(2.25)).toBe(0.25);
  });

  it('should count up from the whole number below when the number is negative', () => {
    expect(toFraction(-0.25)).toBe(0.75);
  });

  it('should give zero when the number is whole', () => {
    expect(toFraction(3)).toBe(0);
  });
});
