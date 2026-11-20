import { runEffect } from '@cassette-canvas/common';
import { describe, expect, it } from 'vitest';

import { tryGetCompiledShader } from './try-get-compiled-shader';

const COMPILE_STATUS = 2;

const SHADER = Object.freeze({ name: 'shader' }) as unknown as WebGLShader;

const createContext = (
  calls: unknown[][],
  compiles: boolean,
): WebGLRenderingContext =>
  ({
    COMPILE_STATUS,
    getShaderParameter: (...values: unknown[]) =>
      runEffect(compiles, () => calls.push(values)),
  }) as unknown as WebGLRenderingContext;

describe('tryGetCompiledShader', () => {
  it('should return the shader when the source compiled', () => {
    expect(tryGetCompiledShader(createContext([], true), SHADER)).toBe(SHADER);
  });

  it('should return nothing when the source did not compile', () => {
    expect(
      tryGetCompiledShader(createContext([], false), SHADER),
    ).toBeUndefined();
  });

  it('should ask the shader whether it compiled when it reads the shader', () => {
    const calls: unknown[][] = [];

    tryGetCompiledShader(createContext(calls, true), SHADER);

    expect(calls).toEqual([[SHADER, COMPILE_STATUS]]);
  });
});
