import { runEffect } from '@cassette-canvas/common';

export const writeVerticesBinding = (
  context: WebGLRenderingContext,
  vertices: WebGLBuffer,
): WebGLBuffer =>
  runEffect(vertices, (target) =>
    context.bindBuffer(context.ARRAY_BUFFER, target),
  );
