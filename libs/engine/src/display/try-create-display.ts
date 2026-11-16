import { pipe } from 'remeda';
import { CRT_CONTEXT_ATTRIBUTES } from '../crt/consts';
import { computeDisplaySize } from './internal/compute-display-size';
import { toDisplayDraft } from './internal/to-display-draft';
import { tryToDisplay } from './internal/try-to-display';
import type { Display } from './types/display';
import type { DisplaySettings } from './types/display-settings';

/**
 * Creates a display on the canvas.
 *
 * - `colors`: the 16 base colors.
 * - `pixelSize`: the width and height of one logical pixel, in canvas pixels.
 * - `spriteSize`: the width and height of every sprite, in logical pixels.
 * - `fps`: the most frames a second it draws, `DEFAULT_MAX_FPS` (640) by
 *   default. `drawScreen` skips a frame that comes sooner than that, so the
 *   rate is never exceeded. Keep the display `drawScreen` returns: it
 *   carries the time of the last frame.
 *
 * The screen size in logical pixels is the canvas size divided by
 * `pixelSize`. The display draws with WebGL, and the monitor effect is
 * always on.
 *
 * Returns `undefined` if the canvas has no WebGL context, the monitor effect
 * cannot be set up, a size is not a positive whole number, `fps` is not a
 * positive number, or the canvas is smaller than one logical pixel.
 */
export const tryCreateDisplay = (
  canvas: HTMLCanvasElement,
  settings: DisplaySettings,
): Display | undefined =>
  pipe(
    {
      context: canvas.getContext('webgl', CRT_CONTEXT_ATTRIBUTES) ?? undefined,
      size: computeDisplaySize(canvas, settings.pixelSize),
    },
    ({ context, size }) => toDisplayDraft(context, size, settings),
    tryToDisplay,
  );
