import { filter, map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FRAGMENT_SHADER_SOURCE } from './fragment-shader-source';
import { tryCreateProgram } from './try-create-program';
import { VERTEX_SHADER_SOURCE } from './vertex-shader-source';

interface ProgramCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const PROGRAM = Object.freeze({ name: 'program' });

const SHADER = Object.freeze({ name: 'shader' });

const createContext = (
  calls: ProgramCall[],
  compiles: boolean,
): WebGLRenderingContext =>
  ({
    VERTEX_SHADER: 1,
    FRAGMENT_SHADER: 2,
    COMPILE_STATUS: 3,
    LINK_STATUS: 4,
    createProgram: () => PROGRAM,
    createShader: () => SHADER,
    shaderSource: (...values: unknown[]) =>
      calls.push({ name: 'shaderSource', values }),
    compileShader: () => undefined,
    getShaderParameter: () => compiles,
    attachShader: () => undefined,
    bindAttribLocation: () => undefined,
    linkProgram: () => undefined,
    getProgramParameter: () => true,
  }) as unknown as WebGLRenderingContext;

describe('tryCreateProgram', () => {
  it('should return the linked program when both shaders compile', () => {
    expect(tryCreateProgram(createContext([], true))).toBe(PROGRAM);
  });

  it('should pass the source of the vertex and the fragment shader of the monitor when it creates the program', () => {
    const calls: ProgramCall[] = [];

    tryCreateProgram(createContext(calls, true));

    expect(
      map(
        filter(calls, (call) => call.name === 'shaderSource'),
        (call) => call.values[1],
      ),
    ).toEqual([VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE]);
  });

  it('should return undefined when a shader does not compile', () => {
    expect(tryCreateProgram(createContext([], false))).toBeUndefined();
  });
});
