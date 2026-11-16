import { describe, expect, it } from 'vitest';

import { HUD_PRESS_SHIFT } from '../consts';
import { computePressShift } from './compute-press-shift';

describe('computePressShift', () => {
  it('should move the face down and right when the pointer holds the button', () => {
    expect(computePressShift(true)).toBe(HUD_PRESS_SHIFT);
  });

  it('should move the face nowhere when the pointer does not hold the button', () => {
    expect(computePressShift(false)).toBe(0);
  });
});
