import { runEffect } from '@cassette-canvas/common';
import { pipe } from 'remeda';
import type { Crt } from '../types/crt';
import type { CrtPicture } from '../types/crt-picture';
import type { CrtFrame } from './types/crt-frame';
import type { CrtTriangle } from './types/crt-triangle';

const FRAME_TEXTURE_UNIT = 0;

const patchCrtProgram = (
  context: WebGLRenderingContext,
  { program }: Crt,
): WebGLRenderingContext =>
  runEffect(context, () => context.useProgram(program));

const patchCrtFrameUniform = (
  context: WebGLRenderingContext,
  { uniforms }: Crt,
): WebGLRenderingContext =>
  runEffect(context, () =>
    context.uniform1i(uniforms.frame, FRAME_TEXTURE_UNIT),
  );

const patchCrtFrameSizeUniform = (
  context: WebGLRenderingContext,
  { uniforms }: Crt,
  { width, height }: CrtPicture,
): WebGLRenderingContext =>
  runEffect(context, () =>
    context.uniform2f(uniforms.frameSize, width, height),
  );

const patchCrtCanvasSizeUniform = (
  context: WebGLRenderingContext,
  { uniforms }: Crt,
): WebGLRenderingContext =>
  runEffect(context, () =>
    context.uniform2f(
      uniforms.canvasSize,
      context.drawingBufferWidth,
      context.drawingBufferHeight,
    ),
  );

const patchCrtPixelSizeUniform = (
  context: WebGLRenderingContext,
  { uniforms }: Crt,
  { pixelSize }: CrtPicture,
): WebGLRenderingContext =>
  runEffect(context, () => context.uniform1f(uniforms.pixelSize, pixelSize));

const patchCrtTimeUniform = (
  context: WebGLRenderingContext,
  { uniforms }: Crt,
  time: number,
): WebGLRenderingContext =>
  runEffect(context, () => context.uniform1f(uniforms.time, time));

export const patchCrtUniforms = ({
  context,
  crt,
  picture,
  time,
}: CrtFrame): CrtTriangle =>
  pipe(
    context,
    (ready) => patchCrtProgram(ready, crt),
    (used) => patchCrtFrameUniform(used, crt),
    (framed) => patchCrtFrameSizeUniform(framed, crt, picture),
    (sized) => patchCrtCanvasSizeUniform(sized, crt),
    (measured) => patchCrtPixelSizeUniform(measured, crt, picture),
    (scaled) => patchCrtTimeUniform(scaled, crt, time),
    (timed) => ({ context: timed, crt }),
  );
