/* eslint-disable no-param-reassign, no-restricted-syntax -- Appendix B exception 1, measured below */
import { floor, isEmpty } from 'lodash-es';
import type { OverlayPlacement } from '../../overlay/types/overlay-placement';
import { AUTHORED_PIXELS } from '../../palette/internal/authored-pixels';
import type { Frame } from '../types/frame';

const paintPlacement = (
  pixels: number[],
  width: number,
  height: number,
  { overlay, row, column }: OverlayPlacement,
): void => {
  const top = floor(row);
  const left = floor(column);

  for (let overlayRow = 0; overlayRow < overlay.height; overlayRow += 1) {
    const place = top + overlayRow;

    if (place >= 0 && place < height) {
      for (
        let overlayColumn = 0;
        overlayColumn < overlay.width;
        overlayColumn += 1
      ) {
        const spot = left + overlayColumn;
        const pixel =
          overlay.pixels[overlayRow * overlay.width + overlayColumn];
        const authored = AUTHORED_PIXELS[pixel ?? 0];

        if (spot >= 0 && spot < width && authored !== undefined) {
          pixels[place * width + spot] = authored;
        }
      }
    }
  }
};

// Style guide - Appendix B exception 1 (hot numeric kernel).
// As a pipeline (one object per overlay pixel, a filter, then edits keyed by
// place), painting the demo HUD over the street frame (320x180, two windows,
// 14,860 overlay pixels) took 7.4 ms per frame (Vite bundle, Node 24). This
// loop takes 0.62 ms. A screen with no overlays is returned as it is. The
// loop only changes the copy it makes itself, and the copy does not change
// after it returns it.
/**
 * Paints the overlays over a lit frame, in order, so later overlays cover
 * earlier ones. Each overlay pixel shows its authored color: no ambient
 * light, no light, and no shadow reaches it. Parts outside the frame are cut
 * off, and transparent pixels leave the lit frame below.
 */
export const patchFrameOverlays = (
  frame: Frame,
  overlays: readonly OverlayPlacement[],
  width: number,
  height: number,
): Frame => {
  if (isEmpty(overlays)) {
    return frame;
  }

  const pixels = Array.from(frame);

  for (const placement of overlays) {
    paintPlacement(pixels, width, height, placement);
  }

  return pixels;
};
