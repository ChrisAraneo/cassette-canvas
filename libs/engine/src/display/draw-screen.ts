import { match } from 'ts-pattern';
import type { Screen } from '../screen/types/screen';
import { drawScreenFrame } from './internal/draw-screen-frame';
import { isFrameDue } from './internal/is-frame-due';
import type { Display } from './types/display';

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
    .with(true, () => drawScreenFrame(display, screen, time))
    .otherwise(() => display);
