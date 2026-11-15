import { runEffect } from '@cassette-canvas/common';
import { pipe } from 'remeda';
import type { Crt } from '../types/crt';
import type { CrtPicture } from '../types/crt-picture';
import type { CrtFrame } from './types/crt-frame';

const BASE_MIPMAP_LEVEL = 0;

const NO_BORDER = 0;

const patchCrtTextureBinding = (
  context: WebGLRenderingContext,
  { texture }: Crt,
): WebGLRenderingContext =>
  runEffect(context, () => context.bindTexture(context.TEXTURE_2D, texture));

const patchCrtTextureImage = (
  context: WebGLRenderingContext,
  { bytes, width, height }: CrtPicture,
): WebGLRenderingContext =>
  runEffect(context, () =>
    context.texImage2D(
      context.TEXTURE_2D,
      BASE_MIPMAP_LEVEL,
      context.RGBA,
      width,
      height,
      NO_BORDER,
      context.RGBA,
      context.UNSIGNED_BYTE,
      new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength),
    ),
  );

export const patchCrtTexture = ({
  context,
  crt,
  picture,
  time,
}: {
  readonly context: WebGLRenderingContext;
  readonly crt: Crt;
  readonly picture: CrtPicture;
  readonly time: number;
}): CrtFrame =>
  pipe(
    context,
    (ready) => patchCrtTextureBinding(ready, crt),
    (bound) => patchCrtTextureImage(bound, picture),
    (uploaded) => ({ context: uploaded, crt, picture, time }),
  );
