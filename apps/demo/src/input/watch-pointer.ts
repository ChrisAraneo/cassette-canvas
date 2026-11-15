import { runEffect } from '@cassette-canvas/common';
import type { HudPointerEvent } from '@cassette-canvas/engine';
import { pipe } from 'remeda';
import { addInputEvent } from './add-input-event';
import { toPointerEvent } from './internal/to-pointer-event';
import type { InputMailbox } from './types/input-mailbox';

const startPointerCapture = (
  event: PointerEvent,
  canvas: HTMLCanvasElement,
): PointerEvent =>
  runEffect(event, (pressed) => canvas.setPointerCapture(pressed.pointerId));

const addPointerEvent = (
  kind: HudPointerEvent['kind'],
  event: PointerEvent,
  canvas: HTMLCanvasElement,
  pixelSize: number,
  mailbox: InputMailbox,
): InputMailbox =>
  addInputEvent(toPointerEvent(kind, event, canvas, pixelSize), mailbox);

const watchPointerPress = (
  canvas: HTMLCanvasElement,
  pixelSize: number,
  mailbox: InputMailbox,
): HTMLCanvasElement =>
  runEffect(canvas, (watched) =>
    watched.addEventListener('pointerdown', (event) =>
      addPointerEvent(
        'PRESS',
        startPointerCapture(event, watched),
        watched,
        pixelSize,
        mailbox,
      ),
    ),
  );

const watchPointerMove = (
  canvas: HTMLCanvasElement,
  pixelSize: number,
  mailbox: InputMailbox,
): HTMLCanvasElement =>
  runEffect(canvas, (watched) =>
    watched.addEventListener('pointermove', (event) =>
      addPointerEvent('MOVE', event, watched, pixelSize, mailbox),
    ),
  );

const watchPointerRelease = (
  canvas: HTMLCanvasElement,
  pixelSize: number,
  mailbox: InputMailbox,
): HTMLCanvasElement =>
  runEffect(canvas, (watched) =>
    watched.addEventListener('pointerup', (event) =>
      addPointerEvent('RELEASE', event, watched, pixelSize, mailbox),
    ),
  );

/**
 * Adds the pointer on a canvas to the mailbox, as HUD events in logical
 * pixels. The canvas captures the pointer while a button is down, so a window
 * that is being dragged keeps following the pointer when it leaves the canvas.
 * The watchers stay for as long as the page lives.
 */
export const watchPointer = (
  canvas: HTMLCanvasElement,
  pixelSize: number,
  mailbox: InputMailbox,
): HTMLCanvasElement =>
  pipe(
    canvas,
    (watched) => watchPointerPress(watched, pixelSize, mailbox),
    (watched) => watchPointerMove(watched, pixelSize, mailbox),
    (watched) => watchPointerRelease(watched, pixelSize, mailbox),
  );
