import { describe, expect, it } from 'vitest';

import { computeFalloff } from './compute-falloff';

const RADIUS = 10;

const computeFalloffAt = (distance: number): number =>
  computeFalloff((distance * distance) / (RADIUS * RADIUS));

describe('computeFalloff', () => {
  it('should return the whole light when the distance is none', () => {
    expect(computeFalloffAt(0)).toBe(1);
  });

  it('should return no light when the distance is the radius', () => {
    expect(computeFalloffAt(RADIUS)).toBe(0);
  });

  it('should return less light when the distance grows', () => {
    expect(computeFalloffAt(2)).toBeLessThan(computeFalloffAt(1));
    expect(computeFalloffAt(5)).toBeLessThan(computeFalloffAt(2));
    expect(computeFalloffAt(9)).toBeLessThan(computeFalloffAt(5));
  });

  it('should return most of the light when the distance is inside the core', () => {
    expect(computeFalloffAt(2)).toBeGreaterThan(0.5);
  });

  it('should return less than half the light when the distance is halfway out', () => {
    expect(computeFalloffAt(RADIUS / 2)).toBeLessThan(0.5);
  });

  it('should return a dim halo when the distance is well past halfway', () => {
    expect(computeFalloffAt(8)).toBeGreaterThan(0);
  });

  it('should return a gentle fade when the distance is at the rim, so no circle shows', () => {
    expect(
      computeFalloffAt(RADIUS - 1) - computeFalloffAt(RADIUS),
    ).toBeLessThan(0.02);
  });
});
