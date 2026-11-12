import { describe, expect, it } from 'vitest';

import {
  EXTENDED_SHADES_PER_STOP,
  MIN_SHADE_OFFSET,
  REFERENCE_EXPOSURE,
} from '../consts';
import { toExposure } from './to-exposure';
import { toShadeOffset } from './to-shade-offset';

describe('toShadeOffset', () => {
  it('should keep the authored color at the reference exposure', () => {
    expect(toShadeOffset(REFERENCE_EXPOSURE)).toBe(0);
  });

  it('should move the pixel up one stop when the light doubles', () => {
    expect(toShadeOffset(2 * REFERENCE_EXPOSURE)).toBe(
      EXTENDED_SHADES_PER_STOP,
    );
  });

  it('should move the pixel down one stop when the light halves', () => {
    expect(toShadeOffset(REFERENCE_EXPOSURE / 2)).toBe(
      -EXTENDED_SHADES_PER_STOP,
    );
  });

  it('should undo toExposure', () => {
    expect(toShadeOffset(toExposure(-7))).toBeCloseTo(-7);
    expect(toShadeOffset(toExposure(5))).toBeCloseTo(5);
  });

  it('should spend the same shades on every doubling', () => {
    expect(toShadeOffset(8) - toShadeOffset(4)).toBeCloseTo(
      toShadeOffset(2) - toShadeOffset(1),
    );
  });

  it('should go no darker than the darkest offset when the light runs out', () => {
    expect(toShadeOffset(0)).toBe(MIN_SHADE_OFFSET);
  });

  it('should go no darker than the darkest offset when lights take light away', () => {
    expect(toShadeOffset(-5)).toBe(MIN_SHADE_OFFSET);
  });
});
