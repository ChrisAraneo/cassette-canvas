import { runEffect } from '@cassette-canvas/common';

const CORNER_COUNT = 3;

const FIRST_CORNER = 0;

export const drawCrtCorners = (
  context: WebGLRenderingContext,
): WebGLRenderingContext =>
  runEffect(context, () =>
    context.drawArrays(context.TRIANGLES, FIRST_CORNER, CORNER_COUNT),
  );
