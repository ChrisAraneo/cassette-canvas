/* eslint-disable no-param-reassign, no-restricted-syntax -- Appendix B exception 1, measured below */
import { constant, floor, times } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { TRANSPARENT } from '../palette/consts';
import { isPixel } from '../palette/is-pixel';
import type { Overlay } from './types/overlay';
import type { OverlayFill } from './types/overlay-fill';
import type { OverlayImage } from './types/overlay-image';
import type { OverlayPaint } from './types/overlay-paint';

const { nonNullable, when } = P;

const toCount = (value: number): number => Math.max(0, floor(value));

const drawFill = (
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

const drawImage = (
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

const drawPaint = (
  pixels: number[],
  width: number,
  height: number,
  paint: OverlayPaint,
): void =>
  match(paint)
    .with({ image: nonNullable }, (image) =>
      drawImage(pixels, width, height, image),
    )
    .with({ pixel: when(isPixel) }, (fill) =>
      drawFill(pixels, width, height, fill),
    )
    .otherwise(constant(undefined));

// Style guide - Appendix B exception 1 (hot numeric kernel).
// As a pipeline (one object per painted pixel, a filter, then edits keyed by
// the overlay row), painting the demo HUD (two windows, 71 paints, 14,860
// pixels) took 6.9 ms per frame (Vite bundle, Node 24). These loops take
// 0.5 ms. The loops are the exception; the step each paint takes is a
// `match`, since it runs once per paint rather than once per pixel. It only
// changes the array it creates itself, and the array does not change after it
// returns it.
/**
 * Draws a list of steps into a new overlay of `width` by `height`. The
 * steps are drawn in order, so later steps cover earlier ones. Parts
 * outside the overlay are cut off, and transparent pixels leave what is
 * below.
 */
export const drawOverlay = (
  width: number,
  height: number,
  paints: readonly OverlayPaint[],
): Overlay => {
  const columns = toCount(width);
  const rows = toCount(height);
  const pixels = times(columns * rows, constant(TRANSPARENT));

  for (const paint of paints) {
    drawPaint(pixels, columns, rows, paint);
  }

  return { width: columns, height: rows, pixels };
};
