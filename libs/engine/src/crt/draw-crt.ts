import { runEffect } from '@cassette-canvas/common';
import { pipe } from 'remeda';
import { drawCrtTriangle } from './internal/draw-crt-triangle';
import { patchCrtTexture } from './internal/patch-crt-texture';
import { patchCrtUniforms } from './internal/patch-crt-uniforms';
import type { Crt } from './types/crt';
import type { CrtPicture } from './types/crt-picture';

/**
 * Draws a frame on the canvas with the monitor effect:
 *
 * - each logical pixel becomes a sharp `pixelSize` square;
 * - bright pixels glow up to 2 canvas pixels outward;
 * - each pixel row has a darker scanline at its bottom;
 * - film grain (animated by `time`, in milliseconds) and a fixed surface
 *   texture are added on top.
 *
 * The effect uses full RGB color, not the palette.
 */
export const drawCrt = (
  context: WebGLRenderingContext,
  crt: Crt,
  picture: CrtPicture,
  time: number,
): void =>
  pipe(
    context,
    (gl) => runEffect(gl, () => patchCrtTexture(gl, crt, picture)),
    (gl) => runEffect(gl, () => patchCrtUniforms(gl, crt, picture, time)),
    (gl) => drawCrtTriangle(gl, crt),
  );
