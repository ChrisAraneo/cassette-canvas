/* eslint-disable no-param-reassign, no-restricted-syntax -- Appendix B exception 1, measured in draw-overlay.ts */
import { floor } from 'lodash-es';
import { toCount } from '../to-count';
import type { OverlayFill } from '../types/overlay-fill';

export const drawFill = (
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
