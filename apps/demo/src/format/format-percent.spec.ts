import { describe, expect, it } from 'vitest';

import { formatPercent } from './format-percent';

describe('formatPercent', () => {
  it('should return 0% when the share is none', () => {
    expect(formatPercent(0)).toBe('  0%');
  });

  it('should return 100% when the share is whole', () => {
    expect(formatPercent(1)).toBe('100%');
  });

  it('should return the share rounded to whole percents when it has a fraction', () => {
    expect(formatPercent(0.426)).toBe(' 43%');
  });

  it('should return 0% when the share is below none', () => {
    expect(formatPercent(-0.5)).toBe('  0%');
  });

  it('should return 100% when the share is above all', () => {
    expect(formatPercent(1.5)).toBe('100%');
  });
});
