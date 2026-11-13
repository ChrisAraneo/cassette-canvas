import { describe, expect, it } from 'vitest';

import { formatClock } from './format-clock';

describe('formatClock', () => {
  it('should show midnight when the day starts', () => {
    expect(formatClock(0)).toBe('00:00');
  });

  it('should show noon when half the day has passed', () => {
    expect(formatClock(0.5)).toBe('12:00');
  });

  it('should round the minutes down to ten when the time is between steps', () => {
    expect(formatClock((9 * 60 + 47) / (24 * 60))).toBe('09:40');
  });

  it('should count the hours up to 23 when it is late in the evening', () => {
    expect(formatClock((23 * 60 + 59) / (24 * 60))).toBe('23:50');
  });
});
