import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { patchTextureSampling } from './patch-texture-sampling';

const { nonNullable } = P;

export const tryCreateTexture = (
  context: WebGLRenderingContext,
): WebGLTexture | undefined =>
  match(context.createTexture())
    .with(nonNullable, (texture) => patchTextureSampling(context, texture))
    .otherwise(constant(undefined));
