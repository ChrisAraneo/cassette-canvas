import { runEffect } from '@cassette-canvas/common';
import { FULL_SCREEN_TRIANGLE } from '../consts';

export const writeVerticesData = (
  context: WebGLRenderingContext,
  vertices: WebGLBuffer,
): WebGLBuffer =>
  runEffect(vertices, () =>
    context.bufferData(
      context.ARRAY_BUFFER,
      new Float32Array(FULL_SCREEN_TRIANGLE),
      context.STATIC_DRAW,
    ),
  );
