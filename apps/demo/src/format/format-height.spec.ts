import { describe, expect, it } from 'vitest';

import { formatHeight } from './format-height';

describe('formatHeight', () => {
  it('should mark a height above the horizon with a plus', () => {
    expect(formatHeight(0.634)).toBe('+0.63');
  });

  it('should mark a height below the horizon with a minus', () => {
    expect(formatHeight(-0.212)).toBe('-0.21');
  });

  it('should show the horizon itself as no height', () => {
    expect(formatHeight(0)).toBe('+0.00');
  });

  it('should keep its width at the top of the sky', () => {
    expect(formatHeight(1)).toBe('+1.00');
  });
});
