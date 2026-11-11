import { match, P } from 'ts-pattern';
import { FRAGMENT_SHADER_SOURCE } from './fragment-shader-source';
import { tryCreateShader } from './try-create-shader';
import { tryLinkProgram } from './try-link-program';
import { VERTEX_SHADER_SOURCE } from './vertex-shader-source';

const { nonNullable } = P;

export const tryCreateProgram = (
  context: WebGLRenderingContext,
): WebGLProgram | undefined =>
  match({
    program: context.createProgram(),
    vertexShader: tryCreateShader(
      context,
      context.VERTEX_SHADER,
      VERTEX_SHADER_SOURCE,
    ),
    fragmentShader: tryCreateShader(
      context,
      context.FRAGMENT_SHADER,
      FRAGMENT_SHADER_SOURCE,
    ),
  })
    .with(
      {
        program: nonNullable,
        vertexShader: nonNullable,
        fragmentShader: nonNullable,
      },
      ({ program, vertexShader, fragmentShader }) =>
        tryLinkProgram(context, program, vertexShader, fragmentShader),
    )
    .otherwise(() => undefined);
