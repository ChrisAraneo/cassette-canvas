import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import { createOverlay } from '../create-overlay';
import { drawPaint } from './draw-paint';

const PANEL = 0x35;

const NOT_A_PIXEL = 0x0a;

const createBlank = (): number[] => times(4, constant(TRANSPARENT));

describe('drawPaint', () => {
  it('should draw the image when the step holds one', () => {
    expect(
      drawPaint(createBlank(), 2, 2, {
        image: createOverlay(2, 1, PANEL),
        row: 0,
        column: 0,
      }),
    ).toEqual([PANEL, PANEL, TRANSPARENT, TRANSPARENT]);
  });

  it('should fill the rectangle when the step holds a color', () => {
    expect(
      drawPaint(createBlank(), 2, 2, {
        pixel: PANEL,
        row: 0,
        column: 0,
        width: 2,
        height: 1,
      }),
    ).toEqual([PANEL, PANEL, TRANSPARENT, TRANSPARENT]);
  });

  it('should draw nothing when the step holds a color it cannot draw', () => {
    expect(
      drawPaint(createBlank(), 2, 2, {
        pixel: NOT_A_PIXEL,
        row: 0,
        column: 0,
        width: 2,
        height: 2,
      }),
    ).toEqual(createBlank());
  });

  it('should draw nothing when the step holds a transparent color', () => {
    expect(
      drawPaint(createBlank(), 2, 2, {
        pixel: TRANSPARENT,
        row: 0,
        column: 0,
        width: 2,
        height: 2,
      }),
    ).toEqual(createBlank());
  });

  it('should return the very same pixels when it draws a step', () => {
    const pixels = createBlank();

    expect(
      drawPaint(pixels, 2, 2, {
        pixel: PANEL,
        row: 0,
        column: 0,
        width: 1,
        height: 1,
      }),
    ).toBe(pixels);
  });
});
