import { runEffect } from '@cassette-canvas/common';
import { pipe } from 'remeda';
import { POSITION_LOCATION } from '../consts';
import type { Crt } from '../types/crt';

const VALUES_PER_CORNER = 2;

const CORNER_COUNT = 3;

export const drawCrtTriangle = (
  context: WebGLRenderingContext,
  { vertices }: Crt,
): void =>
  pipe(
    context,
    (gl) =>
      runEffect(gl, () =>
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight),
      ),
    (gl) => runEffect(gl, () => gl.bindBuffer(gl.ARRAY_BUFFER, vertices)),
    (gl) => runEffect(gl, () => gl.enableVertexAttribArray(POSITION_LOCATION)),
    (gl) =>
      runEffect(gl, () =>
        gl.vertexAttribPointer(
          POSITION_LOCATION,
          VALUES_PER_CORNER,
          gl.FLOAT,
          false,
          0,
          0,
        ),
      ),
    (gl) => gl.drawArrays(gl.TRIANGLES, 0, CORNER_COUNT),
  );
