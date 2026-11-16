import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { patchVertices } from './patch-vertices';

const { nonNullable } = P;

export const tryCreateVertices = (
  context: WebGLRenderingContext,
): WebGLBuffer | undefined =>
  match(context.createBuffer())
    .with(nonNullable, (vertices) => patchVertices(context, vertices))
    .otherwise(constant(undefined));
