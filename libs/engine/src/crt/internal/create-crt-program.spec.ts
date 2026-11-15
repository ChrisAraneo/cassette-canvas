import { noop } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createCrtProgram } from './create-crt-program';

const PROGRAM = Object.freeze({ name: 'program' });

const createContext = (compiles: boolean): WebGLRenderingContext =>
  ({
    createProgram: () => PROGRAM,
    createShader: () => ({ name: 'shader' }),
    shaderSource: noop,
    compileShader: noop,
    getShaderParameter: () => compiles,
    attachShader: noop,
    bindAttribLocation: noop,
    linkProgram: noop,
    getProgramParameter: () => true,
  }) as unknown as WebGLRenderingContext;

describe('createCrtProgram', () => {
  it('should return the linked program when the shaders compile', () => {
    expect(createCrtProgram({ context: createContext(true) }).program).toBe(
      PROGRAM,
    );
  });

  it('should return no program when the shaders do not compile', () => {
    expect(
      createCrtProgram({ context: createContext(false) }).program,
    ).toBeUndefined();
  });

  it('should return no program when there is no context', () => {
    expect(createCrtProgram({ context: undefined }).program).toBeUndefined();
  });

  it('should return the very same context when it makes the program', () => {
    const context = createContext(true);

    expect(createCrtProgram({ context }).context).toBe(context);
  });
});
