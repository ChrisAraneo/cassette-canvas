import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import { createOverlay } from '../create-overlay';
import { toOverlay } from '../to-overlay';
import { drawImage } from './draw-image';

const PANEL = 0x35;

const createBlank = (): number[] => times(6, constant(TRANSPARENT));

describe('drawImage', () => {
  it('should draw the image where the step places it when it draws an image', () => {
    const pixels = createBlank();

    drawImage(pixels, 3, 2, {
      image: createOverlay(2, 1, PANEL),
      row: 0,
      column: 0,
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

  it('should draw nothing when the image holds no pixels', () => {
    const pixels = createBlank();

    drawImage(pixels, 3, 2, {
      image: { width: 0, height: 0, pixels: [] },
      row: 0,
      column: 0,
    });

    expect(pixels).toEqual(createBlank());
  });

  it('should leave what is below when a pixel of the image is transparent', () => {
    const pixels = createBlank();

    drawImage(pixels, 3, 2, {
      image: toOverlay(['.o'], { o: PANEL }),
      row: 0,
      column: 0,
    });

    expect(pixels).toEqual([
      TRANSPARENT,
      PANEL,
      TRANSPARENT,
      TRANSPARENT,
      TRANSPARENT,
      TRANSPARENT,
    ]);
  });

  it('should cut off the parts that fall outside the overlay when the image hangs over an edge', () => {
    const pixels = createBlank();

    drawImage(pixels, 3, 2, {
      image: createOverlay(2, 2, PANEL),
      row: -1,
      column: 2,
    });

    expect(pixels).toEqual([
      TRANSPARENT,
      TRANSPARENT,
      PANEL,
      TRANSPARENT,
      TRANSPARENT,
      TRANSPARENT,
    ]);
  });

  it('should draw at whole pixels only when the image sits between two', () => {
    const pixels = createBlank();

    drawImage(pixels, 3, 2, {
      image: createOverlay(1, 1, PANEL),
      row: 1.7,
      column: 0.7,
    });

    expect(pixels).toEqual([
      TRANSPARENT,
      TRANSPARENT,
      TRANSPARENT,
      PANEL,
      TRANSPARENT,
      TRANSPARENT,
    ]);
  });
});
