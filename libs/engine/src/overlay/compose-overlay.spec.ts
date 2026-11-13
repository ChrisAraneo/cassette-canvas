import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../palette/consts';
import { composeOverlay } from './compose-overlay';
import { createOverlay } from './create-overlay';
import { toOverlay } from './to-overlay';

const BLANK = TRANSPARENT;

describe('composeOverlay', () => {
  it('should draw nothing where no step reaches', () => {
    expect(composeOverlay(2, 2, []).pixels).toEqual([
      BLANK,
      BLANK,
      BLANK,
      BLANK,
    ]);
  });

  it('should fill the rectangle a fill step asks for', () => {
    expect(
      composeOverlay(3, 2, [
        { pixel: 0x35, row: 0, column: 1, width: 2, height: 1 },
      ]).pixels,
    ).toEqual([BLANK, 0x35, 0x35, BLANK, BLANK, BLANK]);
  });

  it('should paint an image at its row and column', () => {
    expect(
      composeOverlay(3, 2, [
        { image: toOverlay(['ox'], { o: 0x35, x: 0x17 }), row: 1, column: 1 },
      ]).pixels,
    ).toEqual([BLANK, BLANK, BLANK, BLANK, 0x35, 0x17]);
  });

  it('should let a later step cover an earlier one', () => {
    expect(
      composeOverlay(2, 1, [
        { pixel: 0x35, row: 0, column: 0, width: 2, height: 1 },
        { pixel: 0x17, row: 0, column: 1, width: 1, height: 1 },
      ]).pixels,
    ).toEqual([0x35, 0x17]);
  });

  it('should leave what is below where an image is transparent', () => {
    expect(
      composeOverlay(2, 1, [
        { pixel: 0x35, row: 0, column: 0, width: 2, height: 1 },
        { image: toOverlay(['.x'], { x: 0x17 }), row: 0, column: 0 },
      ]).pixels,
    ).toEqual([0x35, 0x17]);
  });

  it('should paint nothing for a transparent fill', () => {
    expect(
      composeOverlay(2, 1, [
        { pixel: 0x35, row: 0, column: 0, width: 2, height: 1 },
        { pixel: TRANSPARENT, row: 0, column: 0, width: 2, height: 1 },
      ]).pixels,
    ).toEqual([0x35, 0x35]);
  });

  it('should cut off the parts of a fill that fall outside', () => {
    expect(
      composeOverlay(2, 2, [
        { pixel: 0x35, row: -1, column: 1, width: 4, height: 2 },
      ]).pixels,
    ).toEqual([BLANK, 0x35, BLANK, BLANK]);
  });

  it('should cut off the parts of an image that fall outside', () => {
    expect(
      composeOverlay(2, 1, [
        { image: createOverlay(3, 3, 0x35), row: -1, column: -1 },
      ]).pixels,
    ).toEqual([0x35, 0x35]);
  });

  it('should give an empty overlay when a size is below one', () => {
    expect(
      composeOverlay(0, 4, [
        { pixel: 0x35, row: 0, column: 0, width: 2, height: 2 },
      ]),
    ).toEqual({ width: 0, height: 4, pixels: [] });
  });
});
