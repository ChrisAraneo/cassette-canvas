import { runEffect } from '@cassette-canvas/common';
import type { Crt } from '../types/crt';

export const patchCrtTimeUniform = (
  context: WebGLRenderingContext,
  { uniforms }: Crt,
  time: number,
): WebGLRenderingContext =>
  runEffect(context, () => context.uniform1f(uniforms.time, time));
