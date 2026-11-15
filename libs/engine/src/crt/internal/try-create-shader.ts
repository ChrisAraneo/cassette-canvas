import { runEffect } from '@cassette-canvas/common';
import { constant } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';

const { nonNullable } = P;

const writeShaderSource = (
  context: WebGLRenderingContext,
  shader: WebGLShader,
  source: string,
): WebGLShader =>
  runEffect(shader, (target) => context.shaderSource(target, source));

const runShaderCompiler = (
  context: WebGLRenderingContext,
  shader: WebGLShader,
): WebGLShader => runEffect(shader, (target) => context.compileShader(target));

const tryGetCompiledShader = (
  context: WebGLRenderingContext,
  shader: WebGLShader,
): WebGLShader | undefined =>
  match(context.getShaderParameter(shader, context.COMPILE_STATUS))
    .with(true, () => shader)
    .otherwise(constant(undefined));

const tryPatchShader = (
  context: WebGLRenderingContext,
  shader: WebGLShader,
  source: string,
): WebGLShader | undefined =>
  pipe(
    shader,
    (created) => writeShaderSource(context, created, source),
    (sourced) => runShaderCompiler(context, sourced),
    (compiled) => tryGetCompiledShader(context, compiled),
  );

export const tryCreateShader = (
  context: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | undefined =>
  match(context.createShader(type))
    .with(nonNullable, (shader) => tryPatchShader(context, shader, source))
    .otherwise(constant(undefined));
