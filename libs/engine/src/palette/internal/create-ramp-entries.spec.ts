import { every, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  EXTENDED_SHADE_COUNT,
  LIGHTEST_EXTENDED_SHADE,
  SHADE_COUNT,
} from '../consts';
import { toExtendedPixel } from '../to-extended-pixel';
import { toPixel } from '../to-pixel';
import { createRampEntries } from './create-ramp-entries';

const SAMPLE_COLOR = 3;

const SAMPLE_SHADE = 5;

const SAMPLE_EXTENDED_SHADE = 21;

describe('createRampEntries', () => {
  it('should return one entry per shade sprites can use when it makes the entries', () => {
    expect(size(createRampEntries(SAMPLE_COLOR))).toBe(SHADE_COUNT);
  });

  it('should key each entry by the pixel of its shade when it makes the entries', () => {
    expect(
      map(createRampEntries(SAMPLE_COLOR), ([pixel]) => pixel)[SAMPLE_SHADE],
    ).toBe(toPixel(SAMPLE_COLOR, SAMPLE_SHADE));
  });

  it('should return every extended shade of the color on each entry when it makes the entries', () => {
    expect(
      every(
        createRampEntries(SAMPLE_COLOR),
        ([, ramp]) => size(ramp.pixels) === EXTENDED_SHADE_COUNT,
      ),
    ).toBe(true);
  });

  it('should return the lightest extended shade last when it makes the entries', () => {
    expect(
      createRampEntries(SAMPLE_COLOR)[SAMPLE_SHADE]?.[1].pixels[
        LIGHTEST_EXTENDED_SHADE
      ],
    ).toBe(toExtendedPixel(SAMPLE_COLOR, LIGHTEST_EXTENDED_SHADE));
  });

  it('should return the extended shade each pixel sits on when it makes the entries', () => {
    expect(
      createRampEntries(SAMPLE_COLOR)[SAMPLE_SHADE]?.[1].extendedShade,
    ).toBe(SAMPLE_EXTENDED_SHADE);
  });
});
