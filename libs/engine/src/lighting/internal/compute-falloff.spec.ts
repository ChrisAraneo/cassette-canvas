import { describe, expect, it } from 'vitest';

import { computeFalloff } from './compute-falloff';

const RADIUS = 10;

const atDistance = (distance: number): number =>
  computeFalloff((distance * distance) / (RADIUS * RADIUS));

describe('computeFalloff', () => {
  it('should give the whole light at the center', () => {
    expect(atDistance(0)).toBe(1);
  });

  it('should give no light at the radius', () => {
    expect(atDistance(RADIUS)).toBe(0);
  });

  it('should thin out with every step away from the center', () => {
    expect(atDistance(2)).toBeLessThan(atDistance(1));
    expect(atDistance(5)).toBeLessThan(atDistance(2));
    expect(atDistance(9)).toBeLessThan(atDistance(5));
  });

  it('should keep most of the light inside the core', () => {
    expect(atDistance(2)).toBeGreaterThan(0.5);
  });

  it('should keep less than half the light halfway out', () => {
    expect(atDistance(RADIUS / 2)).toBeLessThan(0.5);
  });

  it('should leave a dim halo well past halfway', () => {
    expect(atDistance(8)).toBeGreaterThan(0);
  });

  it('should fade out gently enough at the rim to leave no visible circle', () => {
    expect(atDistance(RADIUS - 1) - atDistance(RADIUS)).toBeLessThan(0.02);
  });
});
