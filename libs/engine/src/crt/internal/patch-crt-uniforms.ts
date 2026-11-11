import { runEffect } from '@cassette-canvas/common';
import { pipe } from 'remeda';
import type { Crt } from '../types/crt';
import type { CrtPicture } from '../types/crt-picture';

const FRAME_TEXTURE_UNIT = 0;

export const patchCrtUniforms = (
  context: WebGLRenderingContext,
  { program, uniforms }: Crt,
  { width, height, pixelSize }: CrtPicture,
  time: number,
): WebGLRenderingContext =>
  pipe(
    context,
    (gl) => runEffect(gl, () => gl.useProgram(program)),
    (gl) =>
      runEffect(gl, () => gl.uniform1i(uniforms.frame, FRAME_TEXTURE_UNIT)),
    (gl) =>
      runEffect(gl, () => gl.uniform2f(uniforms.frameSize, width, height)),
    (gl) =>
      runEffect(gl, () =>
        gl.uniform2f(
          uniforms.canvasSize,
          gl.drawingBufferWidth,
          gl.drawingBufferHeight,
        ),
      ),
    (gl) => runEffect(gl, () => gl.uniform1f(uniforms.pixelSize, pixelSize)),
    (gl) => runEffect(gl, () => gl.uniform1f(uniforms.time, time)),
  );
