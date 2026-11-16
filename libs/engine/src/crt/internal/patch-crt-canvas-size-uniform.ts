import { runEffect } from '@cassette-canvas/common';
import type { Crt } from '../types/crt';

export const patchCrtCanvasSizeUniform = (
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
