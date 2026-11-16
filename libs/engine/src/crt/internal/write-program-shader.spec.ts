import { describe, expect, it } from 'vitest';

import { writeProgramShader } from './write-program-shader';

const PROGRAM = Object.freeze({ name: 'program' }) as unknown as WebGLProgram;

const SHADER = Object.freeze({ name: 'shader' }) as unknown as WebGLShader;

const createContext = (calls: unknown[][]): WebGLRenderingContext =>
  ({
    attachShader: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('writeProgramShader', () => {
  it('should attach the shader to the program when it writes the shader', () => {
    const calls: unknown[][] = [];

    writeProgramShader(createContext(calls), PROGRAM, SHADER);

    expect(calls).toEqual([[PROGRAM, SHADER]]);
  });

  it('should return the very same program when it writes the shader', () => {
    expect(writeProgramShader(createContext([]), PROGRAM, SHADER)).toBe(
      PROGRAM,
    );
  });
});
