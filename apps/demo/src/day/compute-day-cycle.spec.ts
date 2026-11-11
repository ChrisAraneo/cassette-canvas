import { describe, expect, it } from 'vitest';

import { computeDayCycle } from './compute-day-cycle';
import { DAY_LENGTH, HOURS_PER_DAY, START_HOUR } from './consts';

const HOUR = DAY_LENGTH / HOURS_PER_DAY;

describe('computeDayCycle', () => {
  it('should start at the start hour when no time has passed', () => {
    expect(computeDayCycle(0).phase).toBe(START_HOUR / HOURS_PER_DAY);
  });

  it('should be full daylight when the animation starts', () => {
    expect(computeDayCycle(0).darkness).toBe(0);
  });

  it('should be full daylight when it is noon', () => {
    expect(computeDayCycle((12 - START_HOUR) * HOUR).darkness).toBe(0);
  });

  it('should be night when it is midnight', () => {
    expect(computeDayCycle((24 - START_HOUR) * HOUR).darkness).toBe(1);
  });

  it('should be half dark when the sun sets at 18:00', () => {
    expect(computeDayCycle((18 - START_HOUR) * HOUR).darkness).toBeCloseTo(0.5);
  });

  it('should come back to the same time of day when a whole day has passed', () => {
    expect(computeDayCycle(3 * HOUR + DAY_LENGTH).phase).toBeCloseTo(
      computeDayCycle(3 * HOUR).phase,
    );
  });
});
