import { runEffect } from '@cassette-canvas/common';
import { POSITION_ATTRIBUTE, POSITION_LOCATION } from '../consts';

export const writePositionLocation = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
): WebGLProgram =>
  runEffect(program, (target) =>
    context.bindAttribLocation(target, POSITION_LOCATION, POSITION_ATTRIBUTE),
  );
