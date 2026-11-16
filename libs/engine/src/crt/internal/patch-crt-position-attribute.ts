import { runEffect } from '@cassette-canvas/common';
import { POSITION_LOCATION } from '../consts';

export const patchCrtPositionAttribute = (
  context: WebGLRenderingContext,
): WebGLRenderingContext =>
  runEffect(context, () => context.enableVertexAttribArray(POSITION_LOCATION));
