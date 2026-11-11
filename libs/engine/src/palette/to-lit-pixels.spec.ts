import { flatMap, map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from './consts';
import { toExtendedPixel } from './to-extended-pixel';
import { toLitPixel } from './to-lit-pixel';
import { toLitPixels } from './to-lit-pixels';

interface LitCase {
  readonly pixel: number;
  readonly shadeOffset: number;
}

const FIRST_VALUE_PAST_PIXELS = 0x100;

const SHADE_OFFSETS: readonly number[] = Object.freeze([
  -40, -16.5, -3.25, -0.5, -0.49, 0, 0.49, 0.5, 2.5, 13, 14.5, 40,
]);

const LIT_CASES: readonly LitCase[] = Object.freeze(
  flatMap(range(TRANSPARENT, FIRST_VALUE_PAST_PIXELS), (pixel) =>
    map(SHADE_OFFSETS, (shadeOffset) => ({ pixel, shadeOffset })),
  ),
);

describe('toLitPixels', () => {
  it('should move each pixel along its extended shade ramp by its shade offset', () => {
    expect(
      toLitPixels(
        Int16Array.from([0x34, 0x34, 0x94]),
        Float64Array.from([2, -3, 0]),
      ),
    ).toEqual([
      toExtendedPixel(3, 19),
      toExtendedPixel(3, 14),
      toExtendedPixel(9, 17),
    ]);
  });

  it('should stop at the darkest and the lightest extended shade when the offset goes past them', () => {
    expect(
      toLitPixels(Int16Array.from([0x04, 0x04]), Float64Array.from([-99, 99])),
    ).toEqual([toExtendedPixel(0, 0), toExtendedPixel(0, 31)]);
  });

  it('should round half a shade up when the offset is a fraction', () => {
    expect(
      toLitPixels(
        Int16Array.from([0x04, 0x04]),
        Float64Array.from([0.5, -0.5]),
      ),
    ).toEqual([toExtendedPixel(0, 18), toExtendedPixel(0, 17)]);
  });

  it('should give transparent places when the places hold no pixel', () => {
    expect(
      toLitPixels(
        Int16Array.from([TRANSPARENT, 0x0a, 0x100]),
        Float64Array.from([3, 0, 0]),
      ),
    ).toEqual([TRANSPARENT, TRANSPARENT, TRANSPARENT]);
  });

  it('should give the same pixel as toLitPixel when it lights every value by every offset', () => {
    expect(
      toLitPixels(
        Int16Array.from(map(LIT_CASES, ({ pixel }) => pixel)),
        Float64Array.from(map(LIT_CASES, ({ shadeOffset }) => shadeOffset)),
      ),
    ).toEqual(
      map(LIT_CASES, ({ pixel, shadeOffset }) =>
        toLitPixel(pixel, shadeOffset),
      ),
    );
  });

  it('should give no pixels when there are no places', () => {
    expect(toLitPixels(new Int16Array(0), new Float64Array(0))).toEqual([]);
  });

  it('should not change the pixels or the offsets when it lights them', () => {
    const pixels = Int16Array.from([0x34]);
    const shadeOffsets = Float64Array.from([2]);

    toLitPixels(pixels, shadeOffsets);

    expect([pixels, shadeOffsets]).toEqual([
      Int16Array.from([0x34]),
      Float64Array.from([2]),
    ]);
  });
});
