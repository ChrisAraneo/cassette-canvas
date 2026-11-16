import { map, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SHADE_COUNT } from '../consts';
import { toPixel } from '../to-pixel';
import { createColorEntries } from './create-color-entries';

const SAMPLE_COLOR = 3;

const SAMPLE_SHADE = 5;

const SAMPLE_EXTENDED_SHADE = 21;

const PIXELS: readonly number[] = Object.freeze([1, 2, 3]);

describe('createColorEntries', () => {
  it('should return one entry per shade sprites can use when it makes the entries', () => {
    expect(size(createColorEntries(SAMPLE_COLOR, PIXELS))).toBe(SHADE_COUNT);
  });

  it('should key each entry by the pixel of its shade when it makes the entries', () => {
    expect(
      map(createColorEntries(SAMPLE_COLOR, PIXELS), ([pixel]) => pixel),
    ).toEqual(map(times(SHADE_COUNT), (shade) => toPixel(SAMPLE_COLOR, shade)));
  });

  it('should return the extended shade each pixel sits on when it makes the entries', () => {
    expect(
      createColorEntries(SAMPLE_COLOR, PIXELS)[SAMPLE_SHADE]?.[1].extendedShade,
    ).toBe(SAMPLE_EXTENDED_SHADE);
  });

  it('should carry the very same pixels on every entry when it makes the entries', () => {
    expect(createColorEntries(SAMPLE_COLOR, PIXELS)[0]?.[1].pixels).toBe(
      PIXELS,
    );
  });

  it('should carry no pixels when the color has none', () => {
    expect(createColorEntries(SAMPLE_COLOR, [])[0]?.[1].pixels).toEqual([]);
  });
});
