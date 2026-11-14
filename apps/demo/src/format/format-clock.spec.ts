import { describe, expect, it } from 'vitest';

import { formatClock } from './format-clock';

describe('formatClock', () => {
  it('should return 00:00 when the day starts', () => {
    expect(formatClock(0)).toBe('00:00');
  });

  it('should return 12:00 when half the day has passed', () => {
    expect(formatClock(0.5)).toBe('12:00');
  });

  it('should return the minutes rounded down to ten when the time is between steps', () => {
    expect(formatClock((9 * 60 + 47) / (24 * 60))).toBe('09:40');
  });

  it('should return the hour as 23 when it is late in the evening', () => {
    expect(formatClock((23 * 60 + 59) / (24 * 60))).toBe('23:50');
  });
});
