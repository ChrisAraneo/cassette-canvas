import { runEffect } from '@cassette-canvas/common';
import { POSITION_LOCATION } from '../consts';

const VALUES_PER_CORNER = 2;

const PACKED_STRIDE = 0;

const FIRST_VALUE_OFFSET = 0;

export const patchCrtPositionPointer = (
  context: WebGLRenderingContext,
): WebGLRenderingContext =>
  runEffect(context, () =>
    context.vertexAttribPointer(
      POSITION_LOCATION,
      VALUES_PER_CORNER,
      context.FLOAT,
      false,
      PACKED_STRIDE,
      FIRST_VALUE_OFFSET,
    ),
  );
