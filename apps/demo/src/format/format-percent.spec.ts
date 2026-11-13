import { describe, expect, it } from 'vitest';

import { formatPercent } from './format-percent';

describe('formatPercent', () => {
  it('should show nothing as no percent at all', () => {
    expect(formatPercent(0)).toBe('  0%');
  });

  it('should show a whole share as the full percent', () => {
    expect(formatPercent(1)).toBe('100%');
  });

  it('should round a share to whole percents', () => {
    expect(formatPercent(0.426)).toBe(' 43%');
  });

  it('should keep a share inside the percents when it is below none', () => {
    expect(formatPercent(-0.5)).toBe('  0%');
  });

  it('should keep a share inside the percents when it is above all', () => {
    expect(formatPercent(1.5)).toBe('100%');
  });
});
