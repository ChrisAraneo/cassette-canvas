import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import { toExtendedPixel } from '../../palette/to-extended-pixel';
import { patchFrameShades } from './patch-frame-shades';

describe('patchFrameShades', () => {
  it('should return each pixel moved along its extended shade ramp by its light level when it patches the shades', () => {
    expect(
      patchFrameShades({
        pixels: Int16Array.from([0x34, 0x34, 0x94]),
        levels: Float64Array.from([2, -3, 0]),
      }),
    ).toEqual([
      toExtendedPixel(3, 19),
      toExtendedPixel(3, 14),
      toExtendedPixel(9, 17),
    ]);
  });

  it('should return transparent places transparent when they are lit', () => {
    expect(
      patchFrameShades({
        pixels: Int16Array.from([TRANSPARENT]),
        levels: Float64Array.from([3]),
      }),
    ).toEqual([TRANSPARENT]);
  });

  it('should return transparent places when they hold values that are not pixels', () => {
    expect(
      patchFrameShades({
        pixels: Int16Array.from([0x0a]),
        levels: Float64Array.from([0]),
      }),
    ).toEqual([TRANSPARENT]);
  });

  it('should return an empty frame when the frame is empty', () => {
    expect(
      patchFrameShades({
        pixels: new Int16Array(0),
        levels: new Float64Array(0),
      }),
    ).toEqual([]);
  });

  it('should not change the composed pixels when it shades them', () => {
    const pixels = Int16Array.from([0x34, 0x94]);

    patchFrameShades({ pixels, levels: Float64Array.from([2, 2]) });

    expect(pixels).toEqual(Int16Array.from([0x34, 0x94]));
  });
});
