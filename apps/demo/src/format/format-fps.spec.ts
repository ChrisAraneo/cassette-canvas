import { describe, expect, it } from 'vitest';

import { formatFps } from './format-fps';

describe('formatFps', () => {
  it('should return the frame rate rounded and aligned right when it is measured', () => {
    expect(formatFps(59.6)).toBe(' 60');
  });

  it('should return dashes when the frame rate is not measured yet', () => {
    expect(formatFps(0)).toBe(' --');
  });

  it('should return 999 when the frame rate does not fit', () => {
    expect(formatFps(1440)).toBe('999');
  });

  it('should return 1 when the frame rate is below one frame a second', () => {
    expect(formatFps(0.2)).toBe('  1');
  });
});
