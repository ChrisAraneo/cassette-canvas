import { runEffect } from '@cassette-canvas/common';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { FULL_SCREEN_TRIANGLE } from '../consts';

const { nonNullable } = P;

const patchVertices = (
  context: WebGLRenderingContext,
  vertices: WebGLBuffer,
): WebGLBuffer =>
  pipe(
    vertices,
    (created) =>
      runEffect(created, (target) =>
        context.bindBuffer(context.ARRAY_BUFFER, target),
      ),
    (bound) =>
      runEffect(bound, () =>
        context.bufferData(
          context.ARRAY_BUFFER,
          new Float32Array(FULL_SCREEN_TRIANGLE),
          context.STATIC_DRAW,
        ),
      ),
  );

export const tryCreateVertices = (
  context: WebGLRenderingContext,
): WebGLBuffer | undefined =>
  match(context.createBuffer())
    .with(nonNullable, (vertices) => patchVertices(context, vertices))
    .otherwise(() => undefined);
