import { runEffect } from '@cassette-canvas/common';
import type { Crt } from '../types/crt';

export const patchCrtProgram = (
  context: WebGLRenderingContext,
  { program }: Crt,
): WebGLRenderingContext =>
  runEffect(context, () => context.useProgram(program));
