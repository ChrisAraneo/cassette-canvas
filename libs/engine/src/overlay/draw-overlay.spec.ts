import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../palette/consts';
import { createOverlay } from './create-overlay';
import { drawOverlay } from './draw-overlay';
import { toOverlay } from './to-overlay';
import type { OverlayPaint } from './types/overlay-paint';

const createPaints = (): OverlayPaint[] => [
  { pixel: 0x35, row: 0, column: 0, width: 2, height: 1 },
];

describe('drawOverlay', () => {
  it('should return transparent pixels when no step reaches a place', () => {
    expect(drawOverlay(2, 2, []).pixels).toEqual([
      TRANSPARENT,
      TRANSPARENT,
      TRANSPARENT,
      TRANSPARENT,
    ]);
  });

  it('should return the rectangle a fill step asks for when it draws an overlay', () => {
    expect(
      drawOverlay(3, 2, [
        { pixel: 0x35, row: 0, column: 1, width: 2, height: 1 },
      ]).pixels,
    ).toEqual([TRANSPARENT, 0x35, 0x35, TRANSPARENT, TRANSPARENT, TRANSPARENT]);
  });

  it('should return an image at its row and column when a step holds one', () => {
    expect(
      drawOverlay(3, 2, [
        { image: toOverlay(['ox'], { o: 0x35, x: 0x17 }), row: 1, column: 1 },
      ]).pixels,
    ).toEqual([TRANSPARENT, TRANSPARENT, TRANSPARENT, TRANSPARENT, 0x35, 0x17]);
  });

  it('should return a later step over an earlier one when they overlap', () => {
    expect(
      drawOverlay(2, 1, [
        { pixel: 0x35, row: 0, column: 0, width: 2, height: 1 },
        { pixel: 0x17, row: 0, column: 1, width: 1, height: 1 },
      ]).pixels,
    ).toEqual([0x35, 0x17]);
  });

  it('should return what is below when an image is transparent there', () => {
    expect(
      drawOverlay(2, 1, [
        { pixel: 0x35, row: 0, column: 0, width: 2, height: 1 },
        { image: toOverlay(['.x'], { x: 0x17 }), row: 0, column: 0 },
      ]).pixels,
    ).toEqual([0x35, 0x17]);
  });

  it('should return the pixels below when a fill is transparent', () => {
    expect(
      drawOverlay(2, 1, [
        { pixel: 0x35, row: 0, column: 0, width: 2, height: 1 },
        { pixel: TRANSPARENT, row: 0, column: 0, width: 2, height: 1 },
      ]).pixels,
    ).toEqual([0x35, 0x35]);
  });

  it('should return no parts of a fill when they fall outside', () => {
    expect(
      drawOverlay(2, 2, [
        { pixel: 0x35, row: -1, column: 1, width: 4, height: 2 },
      ]).pixels,
    ).toEqual([TRANSPARENT, 0x35, TRANSPARENT, TRANSPARENT]);
  });

  it('should return no parts of an image when they fall outside', () => {
    expect(
      drawOverlay(2, 1, [
        { image: createOverlay(3, 3, 0x35), row: -1, column: -1 },
      ]).pixels,
    ).toEqual([0x35, 0x35]);
  });

  it('should not change the steps it is given when it draws an overlay', () => {
    const paints = createPaints();

    drawOverlay(2, 1, paints);

    expect(paints).toEqual(createPaints());
  });

  it('should return an empty overlay when a size is below one', () => {
    expect(
      drawOverlay(0, 4, [
        { pixel: 0x35, row: 0, column: 0, width: 2, height: 2 },
      ]),
    ).toEqual({ width: 0, height: 4, pixels: [] });
  });
});
