/* eslint-disable no-param-reassign, no-restricted-syntax -- Appendix B exception 1, measured below */
import { floor } from 'lodash-es';
import { TRANSPARENT } from '../palette/consts';
import { isPixel } from '../palette/is-pixel';
import type { Overlay } from './types/overlay';
import type { OverlayFill } from './types/overlay-fill';
import type { OverlayImage } from './types/overlay-image';
import type { OverlayPaint } from './types/overlay-paint';

const toCount = (value: number): number => Math.max(0, floor(value));

const paintFill = (
  pixels: number[],
  width: number,
  height: number,
  fill: OverlayFill,
): void => {
  const top = Math.max(0, floor(fill.row));
  const left = Math.max(0, floor(fill.column));
  const bottom = Math.min(height, floor(fill.row) + toCount(fill.height));
  const right = Math.min(width, floor(fill.column) + toCount(fill.width));

  for (let row = top; row < bottom; row += 1) {
    for (let column = left; column < right; column += 1) {
      pixels[row * width + column] = fill.pixel;
    }
  }
};

const paintImage = (
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
      const place = top + imageRow;
      const spot = left + imageColumn;
      const isInside =
        place >= 0 && place < height && spot >= 0 && spot < width;

      if (isInside && pixel !== undefined && isPixel(pixel)) {
        pixels[place * width + spot] = pixel;
      }
    }
  }
};

// Style guide - Appendix B exception 1 (hot numeric kernel).
// As a pipeline (one object per painted pixel, a filter, then edits keyed by
// place), painting the demo HUD (two windows, 71 paints, 14,860 pixels) took
// 6.9 ms per frame (Vite bundle, Node 24). This loop takes 0.5 ms. It only
// changes the array it creates itself, and the array does not change after
// it returns it.
/**
 * Paints a list of steps into a new overlay of `width` by `height`. The
 * steps are painted in order, so later steps cover earlier ones. Parts
 * outside the overlay are cut off, and transparent pixels leave what is
 * below.
 */
export const composeOverlay = (
  width: number,
  height: number,
  paints: readonly OverlayPaint[],
): Overlay => {
  const columns = toCount(width);
  const rows = toCount(height);
  const pixels = new Array<number>(columns * rows).fill(TRANSPARENT);

  for (const paint of paints) {
    if ('pixel' in paint) {
      if (isPixel(paint.pixel)) {
        paintFill(pixels, columns, rows, paint);
      }
    } else {
      paintImage(pixels, columns, rows, paint);
    }
  }

  return { width: columns, height: rows, pixels };
};
