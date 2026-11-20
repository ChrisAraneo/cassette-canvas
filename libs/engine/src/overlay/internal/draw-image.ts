/* eslint-disable no-param-reassign, no-restricted-syntax -- Appendix B exception 1, measured in draw-overlay.ts */
import { floor } from 'lodash-es';
import { isPixel } from '../../palette/is-pixel';
import type { OverlayImage } from '../types/overlay-image';

// Style guide - Appendix B exception 1 (hot numeric kernel). The guard below
// is part of the licensed kernel, not just the loop: as a `match` on the same
// condition it measured 0.78 ms per frame against 0.035 ms for the `if` (two
// HUD windows of 110x68 over a 320x180 frame, Node 24), so one closure call
// per overlay pixel dominates the loop it guards.
export const drawImage = (
  pixels: number[],
  width: number,
  height: number,
  { image, row, column }: OverlayImage,
): void => {
  const top = floor(row);
  const left = floor(column);

  for (let imageRow = 0; imageRow < image.height; imageRow += 1) {
    for (let imageColumn = 0; imageColumn < image.width; imageColumn += 1) {
      const pixel = image.pixels[imageRow * image.width + imageColumn];
      const overlayRow = top + imageRow;
      const overlayColumn = left + imageColumn;
      const isInside =
        overlayRow >= 0 &&
        overlayRow < height &&
        overlayColumn >= 0 &&
        overlayColumn < width;

      if (isInside && pixel !== undefined && isPixel(pixel)) {
        pixels[overlayRow * width + overlayColumn] = pixel;
      }
    }
  }
};
