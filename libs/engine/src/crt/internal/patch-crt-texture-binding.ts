import { runEffect } from '@cassette-canvas/common';
import type { Crt } from '../types/crt';

export const patchCrtTextureBinding = (
  context: WebGLRenderingContext,
  { texture }: Crt,
): WebGLRenderingContext =>
  runEffect(context, () => context.bindTexture(context.TEXTURE_2D, texture));
