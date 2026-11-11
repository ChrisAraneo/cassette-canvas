import { describe, expect, it } from 'vitest';

import { LAMPS_ON } from '../consts';
import { computeLampLevel } from './compute-lamp-level';

describe('computeLampLevel', () => {
  it('should keep the lamps off when it is daylight', () => {
    expect(computeLampLevel(0)).toBe(0);
  });

  it('should keep the lamps off until dusk has begun', () => {
    expect(computeLampLevel(LAMPS_ON.from)).toBe(0);
  });

  it('should light the lamps halfway when dusk is halfway through', () => {
    expect(computeLampLevel((LAMPS_ON.from + LAMPS_ON.to) / 2)).toBeCloseTo(
      0.5,
    );
  });

  it('should light the lamps fully when it is night', () => {
    expect(computeLampLevel(1)).toBe(1);
  });
});
