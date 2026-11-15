/* eslint-disable no-restricted-syntax -- Appendix B exception 1, measured below */
import { floor, isEmpty } from 'lodash-es';
import { match } from 'ts-pattern';
import { AUTHORED_PIXELS } from '../../palette/authored-pixels';
import type { OverlayPlacement } from '../../screen/types/overlay-placement';
import type { Frame } from '../types/frame';
import type { FrameOverlays } from './types/frame-overlays';

// Style guide - Appendix B exception 1 (hot numeric kernel).
// As a pipeline (one object per overlay pixel, a filter, then edits keyed by
// the frame row), painting the demo HUD over the street frame (320x180, two
// windows, 14,860 overlay pixels) took 7.4 ms per frame (Vite bundle, Node
// 24). This loop takes 0.62 ms. The loop only changes the copy it makes
// itself, and the copy does not change after it returns it.
const drawFrameOverlays = (
  frame: Frame,
  overlays: readonly OverlayPlacement[],
  width: number,
  height: number,
): Frame => {
  const pixels = Array.from(frame);

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
          const authored = AUTHORED_PIXELS[pixel ?? 0];

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

/**
 * Paints the overlays over a lit frame, in order, so later overlays cover
 * earlier ones. Each overlay pixel shows its authored color: no ambient
 * light, no light, and no shadow reaches it. Parts outside the frame are cut
 * off, and transparent pixels leave the lit frame below. A frame with no
 * overlays comes back as it is.
 */
export const patchFrameOverlays = ({
  frame,
  overlays,
  width,
  height,
}: FrameOverlays): Frame =>
  match(isEmpty(overlays))
    .with(true, () => frame)
    .otherwise(() => drawFrameOverlays(frame, overlays, width, height));
