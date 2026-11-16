import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { tryPatchShader } from './try-patch-shader';

const { nonNullable } = P;

export const tryCreateShader = (
  context: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | undefined =>
  match(context.createShader(type))
    .with(nonNullable, (shader) => tryPatchShader(context, shader, source))
    .otherwise(constant(undefined));
