import { clamp } from 'lodash-es';
import { pipe } from 'remeda';
import { toFraction } from '../math/to-fraction';
import { computeSunHeight } from './compute-sun-height';
import { DAY_LENGTH, HOURS_PER_DAY, START_HOUR, TWILIGHT } from './consts';
import type { DayCycle } from './types/day-cycle';

const computeDarkness = (phase: number): number =>
  clamp((TWILIGHT - computeSunHeight(phase)) / (2 * TWILIGHT), 0, 1);

/**
 * Returns the time of day and how dark it is, `time` milliseconds after the
 * animation started. The animation starts at `START_HOUR`, and a whole day
 * lasts `DAY_LENGTH`.
 */
export const computeDayCycle = (time: number): DayCycle =>
  pipe(time / DAY_LENGTH + START_HOUR / HOURS_PER_DAY, toFraction, (phase) => ({
    phase,
    darkness: computeDarkness(phase),
  }));
