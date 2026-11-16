import { runEffect } from '@cassette-canvas/common';

export const writeTextureBinding = (
  context: WebGLRenderingContext,
  texture: WebGLTexture,
): WebGLTexture =>
  runEffect(texture, (target) =>
    context.bindTexture(context.TEXTURE_2D, target),
  );
