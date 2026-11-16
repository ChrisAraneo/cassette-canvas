import { runEffect } from '@cassette-canvas/common';
import type { CrtPicture } from '../types/crt-picture';

const BASE_MIPMAP_LEVEL = 0;

const NO_BORDER = 0;

export const patchCrtTextureImage = (
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
