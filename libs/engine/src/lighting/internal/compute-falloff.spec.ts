import { describe, expect, it } from 'vitest';

import { computeFalloff } from './compute-falloff';

const RADIUS = 10;

const atDistance = (distance: number): number =>
  computeFalloff((distance * distance) / (RADIUS * RADIUS));

describe('computeFalloff', () => {
  it('should return the whole light when the distance is none', () => {
    expect(atDistance(0)).toBe(1);
  });

  it('should return no light when the distance is the radius', () => {
    expect(atDistance(RADIUS)).toBe(0);
  });

  it('should return less light when the distance grows', () => {
    expect(atDistance(2)).toBeLessThan(atDistance(1));
    expect(atDistance(5)).toBeLessThan(atDistance(2));
    expect(atDistance(9)).toBeLessThan(atDistance(5));
  });

  it('should return most of the light when the distance is inside the core', () => {
    expect(atDistance(2)).toBeGreaterThan(0.5);
  });

  it('should return less than half the light when the distance is halfway out', () => {
    expect(atDistance(RADIUS / 2)).toBeLessThan(0.5);
  });

  it('should return a dim halo when the distance is well past halfway', () => {
    expect(atDistance(8)).toBeGreaterThan(0);
  });

  it('should return a gentle fade when the distance is at the rim, so no circle shows', () => {
    expect(atDistance(RADIUS - 1) - atDistance(RADIUS)).toBeLessThan(0.02);
  });
});
