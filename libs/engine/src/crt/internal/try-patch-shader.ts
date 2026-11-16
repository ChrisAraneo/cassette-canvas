import { pipe } from 'remeda';
import { runShaderCompiler } from './run-shader-compiler';
import { tryGetCompiledShader } from './try-get-compiled-shader';
import { writeShaderSource } from './write-shader-source';

export const tryPatchShader = (
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
