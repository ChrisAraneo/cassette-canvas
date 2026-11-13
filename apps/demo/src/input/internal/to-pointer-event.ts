import type { HudPointerEvent } from '@cassette-canvas/engine';
import { floor } from 'lodash-es';
import { match } from 'ts-pattern';

/** How many canvas pixels one of the page's pixels is worth. */
const computeScale = (canvasSize: number, pageSize: number): number =>
  match(pageSize > 0)
    .with(true, () => canvasSize / pageSize)
    .otherwise(() => 1);

const toLogical = (offset: number, scale: number, pixelSize: number): number =>
  floor((offset * scale) / pixelSize);

/**
 * Turns a pointer event on a canvas into a HUD event in logical pixels: the
 * offset inside the canvas, scaled by however wide the page draws the
 * canvas, and divided by the display's `pixelSize`.
 */
export const toPointerEvent = (
  kind: HudPointerEvent['kind'],
  event: PointerEvent,
  canvas: HTMLCanvasElement,
  pixelSize: number,
): HudPointerEvent => {
  const rect = canvas.getBoundingClientRect();

  return {
    kind,
    row: toLogical(
      event.clientY - rect.top,
      computeScale(canvas.height, rect.height),
      pixelSize,
    ),
    column: toLogical(
      event.clientX - rect.left,
      computeScale(canvas.width, rect.width),
      pixelSize,
    ),
  };
};
