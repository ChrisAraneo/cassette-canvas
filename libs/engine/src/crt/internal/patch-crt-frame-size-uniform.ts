import { runEffect } from '@cassette-canvas/common';
import type { Crt } from '../types/crt';
import type { CrtPicture } from '../types/crt-picture';

export const patchCrtFrameSizeUniform = (
  context: WebGLRenderingContext,
  { uniforms }: Crt,
  { width, height }: CrtPicture,
): WebGLRenderingContext =>
  runEffect(context, () =>
    context.uniform2f(uniforms.frameSize, width, height),
  );
