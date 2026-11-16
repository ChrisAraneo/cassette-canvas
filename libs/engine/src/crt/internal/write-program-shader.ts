import { runEffect } from '@cassette-canvas/common';

export const writeProgramShader = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
  shader: WebGLShader,
): WebGLProgram =>
  runEffect(program, (target) => context.attachShader(target, shader));
