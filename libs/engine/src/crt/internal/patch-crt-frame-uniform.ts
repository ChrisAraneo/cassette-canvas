import { runEffect } from '@cassette-canvas/common';
import type { Crt } from '../types/crt';

const FRAME_TEXTURE_UNIT = 0;

export const patchCrtFrameUniform = (
  context: WebGLRenderingContext,
  { uniforms }: Crt,
): WebGLRenderingContext =>
  runEffect(context, () =>
    context.uniform1i(uniforms.frame, FRAME_TEXTURE_UNIT),
  );
