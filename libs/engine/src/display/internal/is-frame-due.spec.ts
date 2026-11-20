import { describe, expect, it } from 'vitest';

import type { Display } from '../types/display';
import { isFrameDue } from './is-frame-due';

const FPS = 50;

const MILLISECONDS_PER_SECOND = 1000;

const FRAME_INTERVAL = MILLISECONDS_PER_SECOND / FPS;

const DRAWN_AT = 100;

const DUE_TIME = DRAWN_AT + FRAME_INTERVAL;

const TOO_SOON_TIME = DUE_TIME - 1;

const LATE_TIME = 500;

const createDisplay = (drawnAt: number): Display =>
  ({ fps: FPS, drawnAt }) as unknown as Display;

describe('isFrameDue', () => {
  it('should return true when the frame comes a whole frame after the last one', () => {
    expect(isFrameDue(createDisplay(DRAWN_AT), DUE_TIME)).toBe(true);
  });

  it('should return true when the frame comes long after the last one', () => {
    expect(isFrameDue(createDisplay(DRAWN_AT), LATE_TIME)).toBe(true);
  });

  it('should return false when the frame comes sooner than the rate allows', () => {
    expect(isFrameDue(createDisplay(DRAWN_AT), TOO_SOON_TIME)).toBe(false);
  });

  it('should return false when the frame comes at the very time of the last one', () => {
    expect(isFrameDue(createDisplay(DRAWN_AT), DRAWN_AT)).toBe(false);
  });

  it('should return true when the display has drawn nothing yet', () => {
    expect(isFrameDue(createDisplay(Number.NEGATIVE_INFINITY), 0)).toBe(true);
  });
});
