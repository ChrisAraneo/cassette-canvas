import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../palette/consts';
import { composeOverlay } from './compose-overlay';
import { createOverlay } from './create-overlay';
import { toOverlay } from './to-overlay';

const BLANK = TRANSPARENT;

describe('composeOverlay', () => {
  it('should return transparent pixels when no step reaches a place', () => {
    expect(composeOverlay(2, 2, []).pixels).toEqual([
      BLANK,
      BLANK,
      BLANK,
      BLANK,
    ]);
  });

  it('should return the rectangle a fill step asks for when it composes an overlay', () => {
    expect(
      composeOverlay(3, 2, [
        { pixel: 0x35, row: 0, column: 1, width: 2, height: 1 },
      ]).pixels,
    ).toEqual([BLANK, 0x35, 0x35, BLANK, BLANK, BLANK]);
  });

  it('should return an image at its row and column when a step holds one', () => {
    expect(
      composeOverlay(3, 2, [
        { image: toOverlay(['ox'], { o: 0x35, x: 0x17 }), row: 1, column: 1 },
      ]).pixels,
    ).toEqual([BLANK, BLANK, BLANK, BLANK, 0x35, 0x17]);
  });

  it('should return a later step over an earlier one when they overlap', () => {
    expect(
      composeOverlay(2, 1, [
        { pixel: 0x35, row: 0, column: 0, width: 2, height: 1 },
        { pixel: 0x17, row: 0, column: 1, width: 1, height: 1 },
      ]).pixels,
    ).toEqual([0x35, 0x17]);
  });

  it('should return what is below when an image is transparent there', () => {
    expect(
      composeOverlay(2, 1, [
        { pixel: 0x35, row: 0, column: 0, width: 2, height: 1 },
        { image: toOverlay(['.x'], { x: 0x17 }), row: 0, column: 0 },
      ]).pixels,
    ).toEqual([0x35, 0x17]);
  });

  it('should return the pixels below when a fill is transparent', () => {
    expect(
      composeOverlay(2, 1, [
        { pixel: 0x35, row: 0, column: 0, width: 2, height: 1 },
        { pixel: TRANSPARENT, row: 0, column: 0, width: 2, height: 1 },
      ]).pixels,
    ).toEqual([0x35, 0x35]);
  });

  it('should return no parts of a fill when they fall outside', () => {
    expect(
      composeOverlay(2, 2, [
        { pixel: 0x35, row: -1, column: 1, width: 4, height: 2 },
      ]).pixels,
    ).toEqual([BLANK, 0x35, BLANK, BLANK]);
  });

  it('should return no parts of an image when they fall outside', () => {
    expect(
      composeOverlay(2, 1, [
        { image: createOverlay(3, 3, 0x35), row: -1, column: -1 },
      ]).pixels,
    ).toEqual([0x35, 0x35]);
  });

  it('should return an empty overlay when a size is below one', () => {
    expect(
      composeOverlay(0, 4, [
        { pixel: 0x35, row: 0, column: 0, width: 2, height: 2 },
      ]),
    ).toEqual({ width: 0, height: 4, pixels: [] });
  });
});
