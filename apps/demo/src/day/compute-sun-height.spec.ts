import { describe, expect, it } from 'vitest';

import { computeSunHeight } from './compute-sun-height';

describe('computeSunHeight', () => {
  it('should put the sun lowest when it is midnight', () => {
    expect(computeSunHeight(0)).toBe(-1);
  });

  it('should put the sun highest when it is noon', () => {
    expect(computeSunHeight(0.5)).toBe(1);
  });

  it('should put the sun on the horizon when it is 6:00', () => {
    expect(computeSunHeight(0.25)).toBeCloseTo(0);
  });
});
