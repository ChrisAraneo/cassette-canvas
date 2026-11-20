import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import type { OverlayPaint } from '../types/overlay-paint';
import { patchOverlayPixels } from './patch-overlay-pixels';

const PIXEL = 0x35;

const OTHER_PIXEL = 0x46;

const createPixels = (): number[] => [
  TRANSPARENT,
  TRANSPARENT,
  TRANSPARENT,
  TRANSPARENT,
];

const createFill = (pixel: number): OverlayPaint => ({
  pixel,
  row: 0,
  column: 0,
  width: 2,
  height: 1,
});

describe('patchOverlayPixels', () => {
  it('should return the pixels a step asks for when it draws the steps', () => {
    expect(
      patchOverlayPixels({
        width: 2,
        height: 2,
        paints: [createFill(PIXEL)],
        pixels: createPixels(),
      }).pixels,
    ).toEqual([PIXEL, PIXEL, TRANSPARENT, TRANSPARENT]);
  });

  it('should return the pixels of the later step on top when two steps meet', () => {
    expect(
      patchOverlayPixels({
        width: 2,
        height: 2,
        paints: [createFill(PIXEL), createFill(OTHER_PIXEL)],
        pixels: createPixels(),
      }).pixels,
    ).toEqual([OTHER_PIXEL, OTHER_PIXEL, TRANSPARENT, TRANSPARENT]);
  });

  it('should return the size it was given when it draws the steps', () => {
    const overlay = patchOverlayPixels({
      width: 2,
      height: 2,
      paints: [createFill(PIXEL)],
      pixels: createPixels(),
    });

    expect([overlay.width, overlay.height]).toEqual([2, 2]);
  });

  it('should return the pixels unchanged when there is no step at all', () => {
    expect(
      patchOverlayPixels({
        width: 2,
        height: 2,
        paints: [],
        pixels: createPixels(),
      }).pixels,
    ).toEqual(createPixels());
  });
});
