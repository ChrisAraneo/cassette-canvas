import type { Crt } from '../../crt/types/crt';
import type { Palette } from '../../palette/types/palette';

/**
 * A canvas set up for drawing screens. `width` and `height` are in logical
 * pixels: the canvas size divided by `pixelSize`. `fps` is the most frames a
 * second it draws, and `drawnAt` the time of the last frame it drew, in
 * milliseconds, which is how it holds itself to that rate. A display that
 * has drawn nothing yet is `-Infinity` there.
 */
export interface Display {
  readonly context: WebGLRenderingContext;
  readonly crt: Crt;
  readonly palette: Palette;
  readonly pixelSize: number;
  readonly spriteSize: number;
  readonly width: number;
  readonly height: number;
  readonly fps: number;
  readonly drawnAt: number;
}
