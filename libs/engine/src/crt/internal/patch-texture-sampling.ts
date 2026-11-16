import { pipe } from 'remeda';
import { writeTextureBinding } from './write-texture-binding';
import { writeTextureParameter } from './write-texture-parameter';

export const patchTextureSampling = (
  context: WebGLRenderingContext,
  texture: WebGLTexture,
): WebGLTexture =>
  pipe(
    texture,
    (created) => writeTextureBinding(context, created),
    (bound) =>
      writeTextureParameter(
        context,
        bound,
        context.TEXTURE_MIN_FILTER,
        context.NEAREST,
      ),
    (sampled) =>
      writeTextureParameter(
        context,
        sampled,
        context.TEXTURE_MAG_FILTER,
        context.NEAREST,
      ),
    (sampled) =>
      writeTextureParameter(
        context,
        sampled,
        context.TEXTURE_WRAP_S,
        context.CLAMP_TO_EDGE,
      ),
    (wrapped) =>
      writeTextureParameter(
        context,
        wrapped,
        context.TEXTURE_WRAP_T,
        context.CLAMP_TO_EDGE,
      ),
  );
