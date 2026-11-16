import { runEffect } from '@cassette-canvas/common';
import type { Crt } from '../types/crt';

export const patchCrtVertexBuffer = (
  context: WebGLRenderingContext,
  { vertices }: Crt,
): WebGLRenderingContext =>
  runEffect(context, () => context.bindBuffer(context.ARRAY_BUFFER, vertices));
