import { describe, expect, it } from 'vitest';

import { BASE_SHADE, SHADE_COUNT } from '../consts';
import { toExtendedShade } from './to-extended-shade';

describe('toExtendedShade', () => {
  it('should return 1 when the shade is the darkest, so one extended shade sits below it', () => {
    expect(toExtendedShade(0)).toBe(1);
  });

  it('should return four extended shades of distance when the shades are neighbors', () => {
    expect(toExtendedShade(3) - toExtendedShade(2)).toBe(4);
  });

  it('should return the middle of the extended ramp when the shade is the base one', () => {
    expect(toExtendedShade(BASE_SHADE)).toBe(17);
  });

  it('should return 29 when the shade is the lightest, so two extended shades sit above it', () => {
    expect(toExtendedShade(SHADE_COUNT - 1)).toBe(29);
  });
});
