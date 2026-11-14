import { every, keys, size, toNumber } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { COLOR_COUNT, EXTENDED_SHADE_COUNT, SHADE_COUNT } from '../consts';
import { toExtendedPixel } from '../to-extended-pixel';
import { createShadeRamps } from './create-shade-ramps';

describe('createShadeRamps', () => {
  it('should return a ramp for every pixel sprites can use when it makes the ramps', () => {
    expect(size(keys(createShadeRamps()))).toBe(COLOR_COUNT * SHADE_COUNT);
  });

  it('should return all the extended shades of the color of a pixel, darkest first, when it makes the ramps', () => {
    const pixels = createShadeRamps()[0x35]?.pixels;

    expect(size(pixels)).toBe(EXTENDED_SHADE_COUNT);
    expect(pixels?.[0]).toBe(toExtendedPixel(3, 0));
    expect(pixels?.[EXTENDED_SHADE_COUNT - 1]).toBe(toExtendedPixel(3, 31));
  });

  it('should return the extended shade each pixel sits on when it makes the ramps', () => {
    expect(createShadeRamps()[0x35]?.extendedShade).toBe(21);
  });

  it('should return ramps only for pixels sprites can use when it makes them', () => {
    const ramps = createShadeRamps();

    expect(
      every(keys(ramps), (pixel) => toNumber(pixel) % 0x10 < SHADE_COUNT),
    ).toBe(true);
  });
});
