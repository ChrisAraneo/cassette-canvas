/* eslint-disable no-restricted-syntax -- Appendix B exception 1, measured below */
import { floor, toArray } from 'lodash-es';
import { AUTHORED_PIXELS } from '../../palette/authored-pixels';
import type { OverlayPlacement } from '../../screen/types/overlay-placement';
import type { Frame } from '../types/frame';

/** The pixel value looked up where an overlay holds no pixel at all. */
const MISSING_OVERLAY_PIXEL = 0;

// Style guide - Appendix B exception 1 (hot numeric kernel).
// As a pipeline (one object per overlay pixel, a filter, then edits keyed by
// the frame row), painting a HUD over a 320x180 frame (two windows, 14,860
// overlay pixels) took 7.4 ms per frame (Vite bundle, Node 24). This loop
// takes 0.62 ms. The loop only changes the copy it makes itself, and the copy
// does not change after it returns it.
export const drawFrameOverlays = (
  frame: Frame,
  overlays: readonly OverlayPlacement[],
  width: number,
  height: number,
): Frame => {
  const pixels = toArray(frame);

  for (const { overlay, row, column } of overlays) {
    const top = floor(row);
    const left = floor(column);

    for (let overlayRow = 0; overlayRow < overlay.height; overlayRow += 1) {
      const frameRow = top + overlayRow;

      if (frameRow >= 0 && frameRow < height) {
        for (
          let overlayColumn = 0;
          overlayColumn < overlay.width;
          overlayColumn += 1
        ) {
          const frameColumn = left + overlayColumn;
          const pixel =
            overlay.pixels[overlayRow * overlay.width + overlayColumn];
          const authored = AUTHORED_PIXELS[pixel ?? MISSING_OVERLAY_PIXEL];

          if (
            frameColumn >= 0 &&
            frameColumn < width &&
            authored !== undefined
          ) {
            pixels[frameRow * width + frameColumn] = authored;
          }
        }
      }
    }
  }

  return pixels;
};
