import { describe, expect, it } from 'vitest';

import { computeWindow } from './compute-window';

describe('computeWindow', () => {
  it('should return the whole window when the point sits at the center', () => {
    expect(computeWindow(0)).toBe(1);
  });

  it('should close the window when the point sits at the radius', () => {
    expect(computeWindow(1)).toBe(0);
  });

  it('should close the window further when the point moves out', () => {
    expect(computeWindow(0.5)).toBeLessThan(computeWindow(0.25));
    expect(computeWindow(0.75)).toBeLessThan(computeWindow(0.5));
  });

  it('should keep almost the whole window when the point sits deep inside the core', () => {
    expect(computeWindow(0.1)).toBeCloseTo(0.99);
  });

  it('should fade gently when the point nears the radius, so no circle shows', () => {
    expect(computeWindow(0.9) - computeWindow(1)).toBeLessThan(0.2);
  });
});
