import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import { toExtendedPixel } from '../../palette/to-extended-pixel';
import type { OverlayPlacement } from '../../screen/types/overlay-placement';
import { patchFrameShades } from './patch-frame-shades';

const OVERLAYS: readonly OverlayPlacement[] = Object.freeze([]);

describe('patchFrameShades', () => {
  it('should return each pixel moved along its extended shade ramp by its light level when it patches the shades', () => {
    expect(
      patchFrameShades({
        pixels: Int16Array.from([0x34, 0x34, 0x94]),
        levels: Float64Array.from([2, -3, 0]),
        overlays: [],
        width: 3,
        height: 1,
      }).frame,
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
        overlays: [],
        width: 1,
        height: 1,
      }).frame,
    ).toEqual([TRANSPARENT]);
  });

  it('should return transparent places when they hold values that are not pixels', () => {
    expect(
      patchFrameShades({
        pixels: Int16Array.from([0x0a]),
        levels: Float64Array.from([0]),
        overlays: [],
        width: 1,
        height: 1,
      }).frame,
    ).toEqual([TRANSPARENT]);
  });

  it('should return an empty frame when the frame is empty', () => {
    expect(
      patchFrameShades({
        pixels: new Int16Array(0),
        levels: new Float64Array(0),
        overlays: [],
        width: 0,
        height: 0,
      }).frame,
    ).toEqual([]);
  });

  it('should not change the composed pixels when it shades them', () => {
    const pixels = Int16Array.from([0x34, 0x94]);

    patchFrameShades({
      pixels,
      levels: Float64Array.from([2, 2]),
      overlays: [],
      width: 2,
      height: 1,
    });

    expect(pixels).toEqual(Int16Array.from([0x34, 0x94]));
  });

  it('should return the very same overlays, width, and height when it patches the shades', () => {
    const overlays = OVERLAYS;

    expect(
      patchFrameShades({
        pixels: Int16Array.from([0x34]),
        levels: Float64Array.from([0]),
        overlays,
        width: 1,
        height: 1,
      }),
    ).toEqual({
      frame: [toExtendedPixel(3, 17)],
      overlays,
      width: 1,
      height: 1,
    });
  });
});
