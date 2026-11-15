import { describe, expect, it } from 'vitest';

import { computeDayCycle } from './compute-day-cycle';
import { DAY_LENGTH, HOURS_PER_DAY, START_HOUR } from './consts';

const HOUR = DAY_LENGTH / HOURS_PER_DAY;

describe('computeDayCycle', () => {
  it('should give the start hour as the phase when no time has passed', () => {
    expect(computeDayCycle(0).phase).toBeCloseTo(START_HOUR / HOURS_PER_DAY);
  });

  it('should give no darkness when the animation starts', () => {
    expect(computeDayCycle(0).darkness).toBe(0);
  });

  it('should give no darkness when it is noon', () => {
    expect(computeDayCycle((12 - START_HOUR) * HOUR).darkness).toBe(0);
  });

  it('should give full darkness when it is midnight', () => {
    expect(computeDayCycle((24 - START_HOUR) * HOUR).darkness).toBe(1);
  });

  it('should give half the darkness when the sun sets at 18:00', () => {
    expect(computeDayCycle((18 - START_HOUR) * HOUR).darkness).toBeCloseTo(0.5);
  });

  it('should give the same phase when a whole day has passed', () => {
    expect(computeDayCycle(3 * HOUR + DAY_LENGTH).phase).toBeCloseTo(
      computeDayCycle(3 * HOUR).phase,
    );
  });
});
