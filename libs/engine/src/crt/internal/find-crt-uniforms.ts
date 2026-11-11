import { mapValues } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { CRT_UNIFORM_NAMES } from '../consts';
import type { CrtUniforms } from '../types/crt-uniforms';

const { nonNullable } = P;

export const findCrtUniforms = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
): CrtUniforms | undefined =>
  match(
    mapValues(
      CRT_UNIFORM_NAMES,
      (name) => context.getUniformLocation(program, name) ?? undefined,
    ),
  )
    .with(
      {
        frame: nonNullable,
        frameSize: nonNullable,
        canvasSize: nonNullable,
        pixelSize: nonNullable,
        time: nonNullable,
      },
      (uniforms) => uniforms,
    )
    .otherwise(() => undefined);
