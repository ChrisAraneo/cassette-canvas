import { describe, expect, it } from 'vitest';

import { BASE_SHADE, SHADE_COUNT } from '../consts';
import { toExtendedShade } from './to-extended-shade';

describe('toExtendedShade', () => {
  it('should leave one extended shade below the darkest shade', () => {
    expect(toExtendedShade(0)).toBe(1);
  });

  it('should put four extended shades between neighbouring shades', () => {
    expect(toExtendedShade(3) - toExtendedShade(2)).toBe(4);
  });

  it('should put the base shade in the middle of the extended ramp', () => {
    expect(toExtendedShade(BASE_SHADE)).toBe(17);
  });

  it('should leave two extended shades above the lightest shade', () => {
    expect(toExtendedShade(SHADE_COUNT - 1)).toBe(29);
  });
});
