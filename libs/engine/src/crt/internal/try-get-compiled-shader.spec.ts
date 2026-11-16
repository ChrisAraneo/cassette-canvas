import { runEffect } from '@cassette-canvas/common';
import { describe, expect, it } from 'vitest';

import { tryGetCompiledShader } from './try-get-compiled-shader';

const COMPILE_STATUS = 2;

const SHADER = Object.freeze({ name: 'shader' }) as unknown as WebGLShader;

const createContext = (
  compiles: boolean,
  asked: unknown[][],
): WebGLRenderingContext =>
  ({
    COMPILE_STATUS,
    getShaderParameter: (...values: unknown[]) =>
      runEffect(compiles, () => asked.push(values)),
  }) as unknown as WebGLRenderingContext;

describe('tryGetCompiledShader', () => {
  it('should return the shader when the source compiled', () => {
    expect(tryGetCompiledShader(createContext(true, []), SHADER)).toBe(SHADER);
  });

  it('should return nothing when the source did not compile', () => {
    expect(
      tryGetCompiledShader(createContext(false, []), SHADER),
    ).toBeUndefined();
  });

  it('should ask the shader whether it compiled when it reads the shader', () => {
    const asked: unknown[][] = [];

    tryGetCompiledShader(createContext(true, asked), SHADER);

    expect(asked).toEqual([[SHADER, COMPILE_STATUS]]);
  });
});
