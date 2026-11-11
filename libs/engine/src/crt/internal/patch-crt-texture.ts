import { runEffect } from '@cassette-canvas/common';
import { pipe } from 'remeda';
import type { Crt } from '../types/crt';
import type { CrtPicture } from '../types/crt-picture';

export const patchCrtTexture = (
  context: WebGLRenderingContext,
  { texture }: Crt,
  { bytes, width, height }: CrtPicture,
): WebGLRenderingContext =>
  pipe(
    context,
    (gl) => runEffect(gl, () => gl.bindTexture(gl.TEXTURE_2D, texture)),
    (gl) =>
      runEffect(gl, () =>
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          width,
          height,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength),
        ),
      ),
  );
