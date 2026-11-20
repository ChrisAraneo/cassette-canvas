import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import type { OverlayPaint } from '../types/overlay-paint';
import { createOverlayPixels } from './create-overlay-pixels';

const PIXEL = 0x35;

const PAINTS: readonly OverlayPaint[] = Object.freeze([
  { pixel: PIXEL, row: 0, column: 0, width: 2, height: 1 },
]);

describe('createOverlayPixels', () => {
  it('should return a transparent pixel for every place when it creates the pixels', () => {
    expect(
      createOverlayPixels({ width: 2, height: 2, paints: PAINTS }).pixels,
    ).toEqual([TRANSPARENT, TRANSPARENT, TRANSPARENT, TRANSPARENT]);
  });

  it('should return the whole pixels of the size it is given when it creates them', () => {
    expect([
      createOverlayPixels({ width: 2.7, height: 3.2, paints: PAINTS }).width,
      createOverlayPixels({ width: 2.7, height: 3.2, paints: PAINTS }).height,
    ]).toEqual([2, 3]);
  });

  it('should return no pixels at all when the size is below one pixel', () => {
    expect(
      size(createOverlayPixels({ width: 0, height: 4, paints: PAINTS }).pixels),
    ).toBe(0);
  });

  it('should return the very same steps when it creates the pixels', () => {
    expect(
      createOverlayPixels({ width: 2, height: 2, paints: PAINTS }).paints,
    ).toBe(PAINTS);
  });

  it('should return no pixels at all when it is asked for no overlay', () => {
    expect(
      createOverlayPixels({ width: 0, height: 0, paints: [] }).pixels,
    ).toEqual([]);
  });
});
