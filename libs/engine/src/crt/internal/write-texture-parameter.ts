import { runEffect } from '@cassette-canvas/common';

export const writeTextureParameter = (
  context: WebGLRenderingContext,
  texture: WebGLTexture,
  parameter: number,
  value: number,
): WebGLTexture =>
  runEffect(texture, () =>
    context.texParameteri(context.TEXTURE_2D, parameter, value),
  );
