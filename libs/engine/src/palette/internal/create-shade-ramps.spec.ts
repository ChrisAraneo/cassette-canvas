import { every, keys, size, toNumber } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { COLOR_COUNT, EXTENDED_SHADE_COUNT, SHADE_COUNT } from '../consts';
import { toExtendedPixel } from '../to-extended-pixel';
import { createShadeRamps } from './create-shade-ramps';

describe('createShadeRamps', () => {
  it('should hold a ramp for every pixel sprites can use', () => {
    expect(size(keys(createShadeRamps()))).toBe(COLOR_COUNT * SHADE_COUNT);
  });

  it('should give each pixel all the extended shades of its own color, darkest first', () => {
    const pixels = createShadeRamps()[0x35]?.pixels;

    expect(size(pixels)).toBe(EXTENDED_SHADE_COUNT);
    expect(pixels?.[0]).toBe(toExtendedPixel(3, 0));
    expect(pixels?.[EXTENDED_SHADE_COUNT - 1]).toBe(toExtendedPixel(3, 31));
  });

  it('should note the extended shade each pixel sits on', () => {
    expect(createShadeRamps()[0x35]?.extendedShade).toBe(21);
  });

  it('should hold ramps only for pixels sprites can use', () => {
    const ramps = createShadeRamps();

    expect(
      every(keys(ramps), (pixel) => toNumber(pixel) % 0x10 < SHADE_COUNT),
    ).toBe(true);
  });
});
