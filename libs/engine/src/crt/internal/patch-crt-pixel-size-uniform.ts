import { runEffect } from '@cassette-canvas/common';
import type { Crt } from '../types/crt';
import type { CrtPicture } from '../types/crt-picture';

export const patchCrtPixelSizeUniform = (
  context: WebGLRenderingContext,
  { uniforms }: Crt,
  { pixelSize }: CrtPicture,
): WebGLRenderingContext =>
  runEffect(context, () => context.uniform1f(uniforms.pixelSize, pixelSize));
