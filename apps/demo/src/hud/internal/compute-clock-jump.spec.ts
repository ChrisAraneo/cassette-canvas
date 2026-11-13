import { describe, expect, it } from 'vitest';

import { DAY_LENGTH, HOURS_PER_DAY } from '../../day/consts';
import { HOUR_LENGTH } from '../consts';
import { computeClockJump } from './compute-clock-jump';

const toPhase = (hour: number): number => hour / HOURS_PER_DAY;

describe('computeClockJump', () => {
  it('should stay where it is when the street already shows the hour', () => {
    expect(computeClockJump(toPhase(12), 12)).toBe(0);
  });

  it('should jump ahead to an hour later in the day', () => {
    expect(computeClockJump(toPhase(9), 12)).toBe(3 * HOUR_LENGTH);
  });

  it('should jump into the next day when the hour has passed', () => {
    expect(computeClockJump(toPhase(20), 12)).toBe(16 * HOUR_LENGTH);
  });

  it('should never jump back, and never further than a whole day', () => {
    const jump = computeClockJump(toPhase(23), 0);

    expect(jump > 0 && jump < DAY_LENGTH).toBe(true);
  });
});
