import { toPointerEvent } from './internal/to-pointer-event';
import type { InputMailbox } from './types/input-mailbox';

/**
 * Posts the pointer on a canvas to the mailbox, as HUD events in logical
 * pixels. The canvas takes hold of the pointer while a button is down, so a
 * window that is being dragged keeps following the pointer when it leaves
 * the canvas. The listeners stay for as long as the page lives.
 */
export const listenToPointer = (
  canvas: HTMLCanvasElement,
  pixelSize: number,
  mailbox: InputMailbox,
): void => {
  canvas.addEventListener('pointerdown', (event) => {
    canvas.setPointerCapture(event.pointerId);
    mailbox.post(toPointerEvent('press', event, canvas, pixelSize));
  });
  canvas.addEventListener('pointermove', (event) =>
    mailbox.post(toPointerEvent('move', event, canvas, pixelSize)),
  );
  canvas.addEventListener('pointerup', (event) =>
    mailbox.post(toPointerEvent('release', event, canvas, pixelSize)),
  );
};
