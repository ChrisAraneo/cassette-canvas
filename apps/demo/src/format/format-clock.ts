import { floor, padStart, toString } from 'lodash-es';
import { HOURS_PER_DAY } from '../day/consts';
import { CLOCK_STEP, MINUTES_PER_HOUR } from './consts';

const formatTwoDigits = (value: number): string =>
  padStart(toString(value), 2, '0');

const formatClockText = (minutes: number): string =>
  `${formatTwoDigits(floor(minutes / MINUTES_PER_HOUR))}:${formatTwoDigits(minutes % MINUTES_PER_HOUR)}`;

/**
 * Formats a time of day (0 is midnight, 0.5 is noon) as `HH:MM` on a
 * 24-hour clock. The minutes go down to a multiple of `CLOCK_STEP`.
 */
export const formatClock = (phase: number): string =>
  formatClockText(
    floor((phase * HOURS_PER_DAY * MINUTES_PER_HOUR) / CLOCK_STEP) * CLOCK_STEP,
  );
