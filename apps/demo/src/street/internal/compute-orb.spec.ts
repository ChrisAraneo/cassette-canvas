import { describe, expect, it } from 'vitest';

import {
  HORIZON_ROW,
  ORBIT_CENTER,
  ORBIT_HEIGHT,
  ORBIT_WIDTH,
} from '../consts';
import { computeOrb } from './compute-orb';

describe('computeOrb', () => {
  it('should return the sun at the top of its orbit when it is noon', () => {
    expect(computeOrb(0.5)).toEqual({
      row: HORIZON_ROW - ORBIT_HEIGHT,
      column: ORBIT_CENTER,
      height: 1,
    });
  });

  it('should return the sun on the horizon on the left when it is 6:00', () => {
    const orb = computeOrb(0.25);

    expect([orb.row, orb.column]).toEqual([
      HORIZON_ROW,
      ORBIT_CENTER - ORBIT_WIDTH,
    ]);
    expect(orb.height).toBeCloseTo(0);
  });

  it('should return the sun on the horizon on the right when it is 18:00', () => {
    expect(computeOrb(0.75).column).toBe(ORBIT_CENTER + ORBIT_WIDTH);
  });

  it('should return the sun below the horizon when it is midnight', () => {
    expect(computeOrb(0).height).toBe(-1);
  });
});
