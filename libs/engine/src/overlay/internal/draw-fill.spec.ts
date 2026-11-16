import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import { drawFill } from './draw-fill';

const PANEL = 0x35;

const createBlank = (): number[] => times(6, constant(TRANSPARENT));

describe('drawFill', () => {
  it('should fill the rectangle the step names when it draws a fill', () => {
    const pixels = createBlank();

    drawFill(pixels, 3, 2, {
      pixel: PANEL,
      row: 0,
      column: 0,
      width: 2,
      height: 1,
    });

    expect(pixels).toEqual([
      PANEL,
      PANEL,
      TRANSPARENT,
      TRANSPARENT,
      TRANSPARENT,
      TRANSPARENT,
    ]);
  });

  it('should fill nothing when the rectangle has no width or height', () => {
    const pixels = createBlank();

    drawFill(pixels, 3, 2, {
      pixel: PANEL,
      row: 0,
      column: 0,
      width: 0,
      height: 0,
    });

    expect(pixels).toEqual(createBlank());
  });

  it('should cut off the parts that fall outside the overlay when the rectangle hangs over an edge', () => {
    const pixels = createBlank();

    drawFill(pixels, 3, 2, {
      pixel: PANEL,
      row: -1,
      column: 2,
      width: 4,
      height: 4,
    });

    expect(pixels).toEqual([
      TRANSPARENT,
      TRANSPARENT,
      PANEL,
      TRANSPARENT,
      TRANSPARENT,
      PANEL,
    ]);
  });

  it('should fill whole pixels only when the rectangle sits between two', () => {
    const pixels = createBlank();

    drawFill(pixels, 3, 2, {
      pixel: PANEL,
      row: 0.7,
      column: 0.7,
      width: 1.7,
      height: 1.7,
    });

    expect(pixels).toEqual([
      PANEL,
      TRANSPARENT,
      TRANSPARENT,
      TRANSPARENT,
      TRANSPARENT,
      TRANSPARENT,
    ]);
  });
});
