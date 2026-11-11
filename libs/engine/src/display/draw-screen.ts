import { runEffect } from '@cassette-canvas/common';
import { pipe } from 'remeda';
import { drawCrt } from '../crt/draw-crt';
import { computeFrame } from '../frame/compute-frame';
import type { Screen } from '../screen/types/screen';
import { toFrameBytes } from './internal/to-frame-bytes';
import type { Display } from './types/display';

/**
 * Draws the screen on the canvas. It composes and lights the frame, then
 * draws it with the monitor effect. `time` is the current time in
 * milliseconds, for example the `requestAnimationFrame` timestamp. It
 * animates the film grain. Returns the same display.
 */
export const drawScreen = (
  display: Display,
  screen: Screen,
  time: number,
): Display =>
  pipe(
    computeFrame(screen, display.spriteSize, display.width, display.height),
    (frame) => toFrameBytes(frame, display.palette),
    (bytes) =>
      runEffect(display, ({ context, crt, width, height, pixelSize }) =>
        drawCrt(context, crt, { bytes, width, height, pixelSize }, time),
      ),
  );
