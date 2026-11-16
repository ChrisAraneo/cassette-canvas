import { runEffect } from '@cassette-canvas/common';

export const runProgramLinker = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
): WebGLProgram => runEffect(program, (target) => context.linkProgram(target));
