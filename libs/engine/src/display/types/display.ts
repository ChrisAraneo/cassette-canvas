import type { Crt } from '../../crt/types/crt';
import type { Palette } from '../../palette/types/palette';

/**
 * A canvas set up for drawing screens. `width` and `height` are in logical
 * pixels: the canvas size divided by `pixelSize`.
 */
export interface Display {
  readonly context: WebGLRenderingContext;
  readonly crt: Crt;
  readonly palette: Palette;
  readonly pixelSize: number;
  readonly spriteSize: number;
  readonly width: number;
  readonly height: number;
}
