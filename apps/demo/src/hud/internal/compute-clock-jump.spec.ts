import { describe, expect, it } from 'vitest';

import { DAY_LENGTH, HOURS_PER_DAY } from '../../day/consts';
import { HOUR_LENGTH } from '../consts';
import { computeClockJump } from './compute-clock-jump';

const toPhase = (hour: number): number => hour / HOURS_PER_DAY;

describe('computeClockJump', () => {
  it('should return no jump when the street already shows the hour', () => {
    expect(computeClockJump(toPhase(12), 12)).toBe(0);
  });

  it('should return the jump forward when the hour is later in the day', () => {
    expect(computeClockJump(toPhase(9), 12)).toBe(3 * HOUR_LENGTH);
  });

  it('should return the jump into the next day when the hour has passed', () => {
    expect(computeClockJump(toPhase(20), 12)).toBe(16 * HOUR_LENGTH);
  });

  it('should return a jump between none and a whole day when the hour is on the other side of midnight', () => {
    const jump = computeClockJump(toPhase(23), 0);

    expect(jump > 0 && jump < DAY_LENGTH).toBe(true);
  });
});
