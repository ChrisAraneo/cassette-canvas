import { floor, padStart, toString } from 'lodash-es';
import { HOURS_PER_DAY, MINUTES_PER_HOUR } from '../day/consts';
import { CLOCK_STEP } from './consts';

const toTwoDigits = (value: number): string =>
  padStart(toString(value), 2, '0');

const toClockText = (minutes: number): string =>
  `${toTwoDigits(floor(minutes / MINUTES_PER_HOUR))}:${toTwoDigits(minutes % MINUTES_PER_HOUR)}`;

/**
 * Formats a time of day (0 is midnight, 0.5 is noon) as `HH:MM` on a
 * 24-hour clock. The minutes go down to a multiple of `CLOCK_STEP`.
 */
export const formatClock = (phase: number): string =>
  toClockText(
    floor((phase * HOURS_PER_DAY * MINUTES_PER_HOUR) / CLOCK_STEP) * CLOCK_STEP,
  );
