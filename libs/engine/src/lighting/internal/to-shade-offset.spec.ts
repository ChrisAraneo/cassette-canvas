import { describe, expect, it } from 'vitest';

import {
  EXTENDED_SHADES_PER_STOP,
  MIN_SHADE_OFFSET,
  REFERENCE_EXPOSURE,
} from '../consts';
import { toExposure } from './to-exposure';
import { toShadeOffset } from './to-shade-offset';

describe('toShadeOffset', () => {
  it('should return no offset when the exposure is the reference one', () => {
    expect(toShadeOffset(REFERENCE_EXPOSURE)).toBe(0);
  });

  it('should return one stop up when the light doubles', () => {
    expect(toShadeOffset(2 * REFERENCE_EXPOSURE)).toBe(
      EXTENDED_SHADES_PER_STOP,
    );
  });

  it('should return one stop down when the light halves', () => {
    expect(toShadeOffset(REFERENCE_EXPOSURE / 2)).toBe(
      -EXTENDED_SHADES_PER_STOP,
    );
  });

  it('should return the shades toExposure turned into light when it undoes them', () => {
    expect(toShadeOffset(toExposure(-7))).toBeCloseTo(-7);
    expect(toShadeOffset(toExposure(5))).toBeCloseTo(5);
  });

  it('should return the same shades when the exposure doubles', () => {
    expect(toShadeOffset(8) - toShadeOffset(4)).toBeCloseTo(
      toShadeOffset(2) - toShadeOffset(1),
    );
  });

  it('should return the darkest offset when the light runs out', () => {
    expect(toShadeOffset(0)).toBe(MIN_SHADE_OFFSET);
  });

  it('should return the darkest offset when lights take light away', () => {
    expect(toShadeOffset(-5)).toBe(MIN_SHADE_OFFSET);
  });
});
