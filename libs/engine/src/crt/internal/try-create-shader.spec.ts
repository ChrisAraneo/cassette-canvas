import { runEffect } from '@cassette-canvas/common';
import { describe, expect, it } from 'vitest';

import { tryCreateShader } from './try-create-shader';

interface ShaderCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const SHADER = Object.freeze({ name: 'shader' });

const VERTEX_SHADER = 1;

const createContext = (
  calls: ShaderCall[],
  shader: object | null,
  compiles: boolean,
): WebGLRenderingContext =>
  ({
    COMPILE_STATUS: 2,
    createShader: (...values: unknown[]) =>
      runEffect(shader, () => calls.push({ name: 'createShader', values })),
    shaderSource: (...values: unknown[]) =>
      calls.push({ name: 'shaderSource', values }),
    compileShader: (...values: unknown[]) =>
      calls.push({ name: 'compileShader', values }),
    getShaderParameter: () => compiles,
  }) as unknown as WebGLRenderingContext;

describe('tryCreateShader', () => {
  it('should return the compiled shader when the source compiles', () => {
    expect(
      tryCreateShader(createContext([], SHADER, true), VERTEX_SHADER, 'main'),
    ).toBe(SHADER);
  });

  it('should pass the source to the shader and compile it when it creates one', () => {
    const calls: ShaderCall[] = [];

    tryCreateShader(createContext(calls, SHADER, true), VERTEX_SHADER, 'main');

    expect(calls).toEqual([
      { name: 'createShader', values: [VERTEX_SHADER] },
      { name: 'shaderSource', values: [SHADER, 'main'] },
      { name: 'compileShader', values: [SHADER] },
    ]);
  });

  it('should return undefined when the source does not compile', () => {
    expect(
      tryCreateShader(createContext([], SHADER, false), VERTEX_SHADER, 'oops'),
    ).toBeUndefined();
  });

  it('should return undefined when the context cannot make one', () => {
    expect(
      tryCreateShader(createContext([], null, true), VERTEX_SHADER, 'main'),
    ).toBeUndefined();
  });
});
