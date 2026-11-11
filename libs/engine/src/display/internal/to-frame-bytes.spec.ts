import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import type { Palette } from '../../palette/types/palette';
import { toFrameBytes } from './to-frame-bytes';

const PALETTE: Palette = Object.freeze({
  0x14: { red: 10, green: 20, blue: 30 },
  0x54: { red: 40, green: 50, blue: 60 },
});

describe('toFrameBytes', () => {
  it('should write each pixel as opaque red, green and blue bytes when the palette holds it', () => {
    expect(toFrameBytes([0x14, 0x54], PALETTE)).toEqual(
      Uint8ClampedArray.from([10, 20, 30, 255, 40, 50, 60, 255]),
    );
  });

  it('should write a clear pixel when the pixel is transparent', () => {
    expect(toFrameBytes([TRANSPARENT], PALETTE)).toEqual(
      Uint8ClampedArray.from([0, 0, 0, 0]),
    );
  });

  it('should write a clear pixel when the palette does not hold the pixel', () => {
    expect(toFrameBytes([0x77], PALETTE)).toEqual(
      Uint8ClampedArray.from([0, 0, 0, 0]),
    );
  });

  it('should write no bytes when the frame is empty', () => {
    expect(toFrameBytes([], PALETTE)).toEqual(Uint8ClampedArray.from([]));
  });
});
