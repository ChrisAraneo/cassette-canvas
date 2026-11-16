import { describe, expect, it } from 'vitest';

import { runShaderCompiler } from './run-shader-compiler';

const SHADER = Object.freeze({ name: 'shader' }) as unknown as WebGLShader;

const createContext = (compiled: unknown[]): WebGLRenderingContext =>
  ({
    compileShader: (shader: unknown) => compiled.push(shader),
  }) as unknown as WebGLRenderingContext;

describe('runShaderCompiler', () => {
  it('should compile the shader when it runs the compiler', () => {
    const compiled: unknown[] = [];

    runShaderCompiler(createContext(compiled), SHADER);

    expect(compiled).toEqual([SHADER]);
  });

  it('should return the very same shader when it runs the compiler', () => {
    expect(runShaderCompiler(createContext([]), SHADER)).toBe(SHADER);
  });
});
