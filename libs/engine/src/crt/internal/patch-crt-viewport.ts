import { runEffect } from '@cassette-canvas/common';

const VIEWPORT_ORIGIN = 0;

export const patchCrtViewport = (
  context: WebGLRenderingContext,
): WebGLRenderingContext =>
  runEffect(context, () =>
    context.viewport(
      VIEWPORT_ORIGIN,
      VIEWPORT_ORIGIN,
      context.drawingBufferWidth,
      context.drawingBufferHeight,
    ),
  );
