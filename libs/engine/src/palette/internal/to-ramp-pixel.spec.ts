import { map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  DARKEST_EXTENDED_SHADE,
  EXTENDED_SHADE_COUNT,
  LIGHTEST_EXTENDED_SHADE,
  TRANSPARENT,
} from '../consts';
import { toRampPixel } from './to-ramp-pixel';
import type { ShadeRamp } from './types/shade-ramp';

const MIDDLE_EXTENDED_SHADE = 21;

const HALF_STEP = 0.5;

const ONE_STEP_UP = 1;

const FAR_ABOVE_THE_LIGHTEST = 100;

const FAR_BELOW_THE_DARKEST = -100;

const RAMP: ShadeRamp = Object.freeze({
  pixels: map(range(EXTENDED_SHADE_COUNT), (extendedShade) => extendedShade),
  extendedShade: MIDDLE_EXTENDED_SHADE,
});

const EMPTY_RAMP: ShadeRamp = Object.freeze({
  pixels: [],
  extendedShade: MIDDLE_EXTENDED_SHADE,
});

describe('toRampPixel', () => {
  it('should return the pixel the ramp sits on when nothing moves it', () => {
    expect(toRampPixel(RAMP, 0)).toBe(MIDDLE_EXTENDED_SHADE);
  });

  it('should return the pixel that many extended shades up when the light lifts it', () => {
    expect(toRampPixel(RAMP, ONE_STEP_UP)).toBe(
      MIDDLE_EXTENDED_SHADE + ONE_STEP_UP,
    );
  });

  it('should return the nearest extended shade when the offset falls between two', () => {
    expect(toRampPixel(RAMP, HALF_STEP)).toBe(
      MIDDLE_EXTENDED_SHADE + ONE_STEP_UP,
    );
  });

  it('should return the lightest pixel when the offset reaches past it', () => {
    expect(toRampPixel(RAMP, FAR_ABOVE_THE_LIGHTEST)).toBe(
      LIGHTEST_EXTENDED_SHADE,
    );
  });

  it('should return the darkest pixel when the offset reaches below it', () => {
    expect(toRampPixel(RAMP, FAR_BELOW_THE_DARKEST)).toBe(
      DARKEST_EXTENDED_SHADE,
    );
  });

  it('should return a transparent pixel when the ramp holds no pixels', () => {
    expect(toRampPixel(EMPTY_RAMP, 0)).toBe(TRANSPARENT);
  });
});
