import { runEffect } from '@cassette-canvas/common';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { drawCrt } from '../crt/draw-crt';
import { computeFrame } from '../frame/compute-frame';
import type { Screen } from '../screen/types/screen';
import { isFrameDue } from './internal/is-frame-due';
import { toFrameBytes } from './internal/to-frame-bytes';
import type { Display } from './types/display';

const paintScreen = (display: Display, screen: Screen, time: number): Display =>
  pipe(
    computeFrame(screen, display.spriteSize, display.width, display.height),
    (frame) => toFrameBytes(frame, display.palette),
    (bytes) =>
      runEffect(
        { ...display, drawnAt: time },
        ({ context, crt, width, height, pixelSize }) =>
          drawCrt(context, crt, { bytes, width, height, pixelSize }, time),
      ),
  );

/**
 * Draws the screen on the canvas. It composes and lights the frame, then
 * draws it with the monitor effect. `time` is the current time in
 * milliseconds, for example the `requestAnimationFrame` timestamp. It
 * animates the film grain.
 *
 * Returns the display with the time of the frame on it, so keep it for the
 * next frame: a frame that comes sooner than the display's `fps` allows is
 * skipped, and the display comes back untouched.
 */
export const drawScreen = (
  display: Display,
  screen: Screen,
  time: number,
): Display =>
  match(isFrameDue(display, time))
    .with(true, () => paintScreen(display, screen, time))
    .otherwise(() => display);
