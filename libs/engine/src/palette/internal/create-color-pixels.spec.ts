import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  DARKEST_EXTENDED_SHADE,
  EXTENDED_SHADE_COUNT,
  LIGHTEST_EXTENDED_SHADE,
} from '../consts';
import { toExtendedPixel } from '../to-extended-pixel';
import { createColorPixels } from './create-color-pixels';

const SAMPLE_COLOR = 3;

describe('createColorPixels', () => {
  it('should return every extended shade of the color when it makes the pixels', () => {
    expect(size(createColorPixels(SAMPLE_COLOR))).toBe(EXTENDED_SHADE_COUNT);
  });

  it('should return the shades darkest first when it makes the pixels', () => {
    const pixels = createColorPixels(SAMPLE_COLOR);

    expect(pixels[DARKEST_EXTENDED_SHADE]).toBe(
      toExtendedPixel(SAMPLE_COLOR, DARKEST_EXTENDED_SHADE),
    );
    expect(pixels[LIGHTEST_EXTENDED_SHADE]).toBe(
      toExtendedPixel(SAMPLE_COLOR, LIGHTEST_EXTENDED_SHADE),
    );
  });

  it('should return the shades of the first color when the color is the first one', () => {
    expect(createColorPixels(0)[DARKEST_EXTENDED_SHADE]).toBe(
      toExtendedPixel(0, DARKEST_EXTENDED_SHADE),
    );
  });
});
