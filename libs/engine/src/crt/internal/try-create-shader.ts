import { runEffect } from '@cassette-canvas/common';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';

const { nonNullable } = P;

const tryCompileShader = (
  context: WebGLRenderingContext,
  shader: WebGLShader,
  source: string,
): WebGLShader | undefined =>
  pipe(
    shader,
    (created) =>
      runEffect(created, (target) => context.shaderSource(target, source)),
    (sourced) => runEffect(sourced, (target) => context.compileShader(target)),
    (compiled) =>
      match(context.getShaderParameter(compiled, context.COMPILE_STATUS))
        .with(true, () => compiled)
        .otherwise(() => undefined),
  );

export const tryCreateShader = (
  context: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | undefined =>
  match(context.createShader(type))
    .with(nonNullable, (shader) => tryCompileShader(context, shader, source))
    .otherwise(() => undefined);
