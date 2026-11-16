import { runEffect } from '@cassette-canvas/common';

export const runShaderCompiler = (
  context: WebGLRenderingContext,
  shader: WebGLShader,
): WebGLShader => runEffect(shader, (target) => context.compileShader(target));
