import { runEffect } from '@cassette-canvas/common';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';

const { nonNullable } = P;

const patchTextureSampling = (
  context: WebGLRenderingContext,
  texture: WebGLTexture,
): WebGLTexture =>
  pipe(
    texture,
    (created) =>
      runEffect(created, (target) =>
        context.bindTexture(context.TEXTURE_2D, target),
      ),
    (bound) =>
      runEffect(bound, () =>
        context.texParameteri(
          context.TEXTURE_2D,
          context.TEXTURE_MIN_FILTER,
          context.NEAREST,
        ),
      ),
    (bound) =>
      runEffect(bound, () =>
        context.texParameteri(
          context.TEXTURE_2D,
          context.TEXTURE_MAG_FILTER,
          context.NEAREST,
        ),
      ),
    (bound) =>
      runEffect(bound, () =>
        context.texParameteri(
          context.TEXTURE_2D,
          context.TEXTURE_WRAP_S,
          context.CLAMP_TO_EDGE,
        ),
      ),
    (bound) =>
      runEffect(bound, () =>
        context.texParameteri(
          context.TEXTURE_2D,
          context.TEXTURE_WRAP_T,
          context.CLAMP_TO_EDGE,
        ),
      ),
  );

export const tryCreateTexture = (
  context: WebGLRenderingContext,
): WebGLTexture | undefined =>
  match(context.createTexture())
    .with(nonNullable, (texture) => patchTextureSampling(context, texture))
    .otherwise(() => undefined);
