import { describe, expect, it } from 'vitest';

import { LAMPS_ON } from '../consts';
import { computeLampLevel } from './compute-lamp-level';

describe('computeLampLevel', () => {
  it('should return zero when it is daylight', () => {
    expect(computeLampLevel(0)).toBe(0);
  });

  it('should return zero when dusk has just begun', () => {
    expect(computeLampLevel(LAMPS_ON.from)).toBe(0);
  });

  it('should return half the level when dusk is halfway through', () => {
    expect(computeLampLevel((LAMPS_ON.from + LAMPS_ON.to) / 2)).toBeCloseTo(
      0.5,
    );
  });

  it('should return the full level when it is night', () => {
    expect(computeLampLevel(1)).toBe(1);
  });
});
