import { runEffect } from '@cassette-canvas/common';
import { pipe } from 'remeda';
import { POSITION_LOCATION } from '../consts';
import type { Crt } from '../types/crt';
import type { CrtTriangle } from './types/crt-triangle';

const VALUES_PER_CORNER = 2;

const CORNER_COUNT = 3;

const PACKED_STRIDE = 0;

const FIRST_VALUE_OFFSET = 0;

const VIEWPORT_ORIGIN = 0;

const FIRST_CORNER = 0;

const patchCrtViewport = (
  context: WebGLRenderingContext,
): WebGLRenderingContext =>
  runEffect(context, () =>
    context.viewport(
      VIEWPORT_ORIGIN,
      VIEWPORT_ORIGIN,
      context.drawingBufferWidth,
      context.drawingBufferHeight,
    ),
  );

const patchCrtVertexBuffer = (
  context: WebGLRenderingContext,
  { vertices }: Crt,
): WebGLRenderingContext =>
  runEffect(context, () => context.bindBuffer(context.ARRAY_BUFFER, vertices));

const patchCrtPositionAttribute = (
  context: WebGLRenderingContext,
): WebGLRenderingContext =>
  runEffect(context, () => context.enableVertexAttribArray(POSITION_LOCATION));

const patchCrtPositionPointer = (
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

const drawCrtCorners = (context: WebGLRenderingContext): void =>
  context.drawArrays(context.TRIANGLES, FIRST_CORNER, CORNER_COUNT);

export const drawCrtTriangle = ({ context, crt }: CrtTriangle): void =>
  pipe(
    context,
    patchCrtViewport,
    (ready) => patchCrtVertexBuffer(ready, crt),
    patchCrtPositionAttribute,
    patchCrtPositionPointer,
    drawCrtCorners,
  );
