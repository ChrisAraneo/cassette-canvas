import { every, keys, size, toNumber } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  COLOR_COUNT,
  COLOR_STRIDE,
  DARKEST_EXTENDED_SHADE,
  EXTENDED_SHADE_COUNT,
  LIGHTEST_EXTENDED_SHADE,
  SHADE_COUNT,
} from '../consts';
import { toExtendedPixel } from '../to-extended-pixel';
import { toPixel } from '../to-pixel';
import { createShadeRamps } from './create-shade-ramps';

const SAMPLE_COLOR = 3;

const SAMPLE_SHADE = 5;

const SAMPLE_PIXEL = toPixel(SAMPLE_COLOR, SAMPLE_SHADE);

const SAMPLE_EXTENDED_SHADE = 21;

describe('createShadeRamps', () => {
  it('should return a ramp for every pixel sprites can use when it makes the ramps', () => {
    expect(size(keys(createShadeRamps()))).toBe(COLOR_COUNT * SHADE_COUNT);
  });

  it('should return all the extended shades of the color of a pixel, darkest first, when it makes the ramps', () => {
    const pixels = createShadeRamps()[SAMPLE_PIXEL]?.pixels;

    expect(size(pixels)).toBe(EXTENDED_SHADE_COUNT);
    expect(pixels?.[DARKEST_EXTENDED_SHADE]).toBe(
      toExtendedPixel(SAMPLE_COLOR, DARKEST_EXTENDED_SHADE),
    );
    expect(pixels?.[LIGHTEST_EXTENDED_SHADE]).toBe(
      toExtendedPixel(SAMPLE_COLOR, LIGHTEST_EXTENDED_SHADE),
    );
  });

  it('should return the extended shade each pixel sits on when it makes the ramps', () => {
    expect(createShadeRamps()[SAMPLE_PIXEL]?.extendedShade).toBe(
      SAMPLE_EXTENDED_SHADE,
    );
  });

  it('should return ramps only for pixels sprites can use when it makes them', () => {
    const ramps = createShadeRamps();

    expect(
      every(
        keys(ramps),
        (pixel) => toNumber(pixel) % COLOR_STRIDE < SHADE_COUNT,
      ),
    ).toBe(true);
  });
});
