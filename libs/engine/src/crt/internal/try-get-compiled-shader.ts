import { constant } from 'lodash-es';
import { match } from 'ts-pattern';

export const tryGetCompiledShader = (
  context: WebGLRenderingContext,
  shader: WebGLShader,
): WebGLShader | undefined =>
  match(context.getShaderParameter(shader, context.COMPILE_STATUS))
    .with(true, () => shader)
    .otherwise(constant(undefined));
