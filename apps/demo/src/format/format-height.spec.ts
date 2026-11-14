import { describe, expect, it } from 'vitest';

import { formatHeight } from './format-height';

describe('formatHeight', () => {
  it('should return a plus sign when the height is above the horizon', () => {
    expect(formatHeight(0.634)).toBe('+0.63');
  });

  it('should return a minus sign when the height is below the horizon', () => {
    expect(formatHeight(-0.212)).toBe('-0.21');
  });

  it('should return +0.00 when the height is the horizon', () => {
    expect(formatHeight(0)).toBe('+0.00');
  });

  it('should return the same width when the height is the top of the sky', () => {
    expect(formatHeight(1)).toBe('+1.00');
  });
});
