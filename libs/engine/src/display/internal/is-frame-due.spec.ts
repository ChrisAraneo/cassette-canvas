import { describe, expect, it } from 'vitest';

import type { Display } from '../types/display';
import { isFrameDue } from './is-frame-due';

/** A display that draws 50 frames a second, so one frame lasts 20 ms. */
const createDisplay = (drawnAt: number): Display =>
  ({ fps: 50, drawnAt }) as unknown as Display;

describe('isFrameDue', () => {
  it('should return true when the frame comes a whole frame after the last one', () => {
    expect(isFrameDue(createDisplay(100), 120)).toBe(true);
  });

  it('should return true when the frame comes long after the last one', () => {
    expect(isFrameDue(createDisplay(100), 500)).toBe(true);
  });

  it('should return false when the frame comes sooner than the rate allows', () => {
    expect(isFrameDue(createDisplay(100), 119)).toBe(false);
  });

  it('should return false when the frame comes at the very time of the last one', () => {
    expect(isFrameDue(createDisplay(100), 100)).toBe(false);
  });

  it('should return true when the display has drawn nothing yet', () => {
    expect(isFrameDue(createDisplay(Number.NEGATIVE_INFINITY), 0)).toBe(true);
  });
});
