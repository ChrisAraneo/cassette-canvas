import { describe, expect, it } from 'vitest';

import { tryPatchShader } from './try-patch-shader';

interface ShaderCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const SHADER = Object.freeze({ name: 'shader' }) as unknown as WebGLShader;

const createContext = (
  calls: ShaderCall[],
  compiles: boolean,
): WebGLRenderingContext =>
  ({
    COMPILE_STATUS: 2,
    shaderSource: (...values: unknown[]) =>
      calls.push({ name: 'shaderSource', values }),
    compileShader: (...values: unknown[]) =>
      calls.push({ name: 'compileShader', values }),
    getShaderParameter: () => compiles,
  }) as unknown as WebGLRenderingContext;

describe('tryPatchShader', () => {
  it('should return the shader when the source compiles', () => {
    expect(tryPatchShader(createContext([], true), SHADER, 'main')).toBe(
      SHADER,
    );
  });

  it('should return nothing when the source does not compile', () => {
    expect(
      tryPatchShader(createContext([], false), SHADER, 'main'),
    ).toBeUndefined();
  });

  it('should pass the source in before it compiles the shader when it patches one', () => {
    const calls: ShaderCall[] = [];

    tryPatchShader(createContext(calls, true), SHADER, 'main');

    expect(calls).toEqual([
      { name: 'shaderSource', values: [SHADER, 'main'] },
      { name: 'compileShader', values: [SHADER] },
    ]);
  });
});
