import { clamp, padStart, round, toString } from 'lodash-es';
import { PERCENT_DIGITS } from './consts';

const FULL_PERCENT = 100;

/**
 * Formats a share (0 to 1) as a whole percent, right-aligned in
 * `PERCENT_DIGITS` characters, so the text keeps its width as the number
 * moves.
 */
export const formatPercent = (share: number): string =>
  padStart(
    `${toString(round(clamp(share, 0, 1) * FULL_PERCENT))}%`,
    PERCENT_DIGITS,
  );
