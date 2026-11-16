import { runEffect } from '@cassette-canvas/common';

export const writeShaderSource = (
  context: WebGLRenderingContext,
  shader: WebGLShader,
  source: string,
): WebGLShader =>
  runEffect(shader, (target) => context.shaderSource(target, source));
