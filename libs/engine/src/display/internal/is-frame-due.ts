import type { Display } from '../types/display';

const MILLISECONDS_PER_SECOND = 1000;

/**
 * Returns `true` when enough time has passed since the display's last frame
 * for the next one, which is a second divided by its `fps`. A display that
 * has drawn nothing yet is always due.
 */
export const isFrameDue = (display: Display, time: number): boolean =>
  time - display.drawnAt >= MILLISECONDS_PER_SECOND / display.fps;
