import { noop } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { tryCreateCrt } from './try-create-crt';

const PROGRAM = Object.freeze({ name: 'program' });

const TEXTURE = Object.freeze({ name: 'texture' });

const BUFFER = Object.freeze({ name: 'buffer' });

interface ContextParts {
  readonly compiles: boolean;
  readonly texture: object | null;
}

const createContext = ({
  compiles,
  texture,
}: ContextParts): WebGLRenderingContext =>
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
    createTexture: () => texture,
    bindTexture: noop,
    texParameteri: noop,
    createBuffer: () => BUFFER,
    bindBuffer: noop,
    bufferData: noop,
    getUniformLocation: (_: unknown, name: string) => ({ name }),
  }) as unknown as WebGLRenderingContext;

describe('tryCreateCrt', () => {
  it('should gather the program, the texture and the vertices when every part is made', () => {
    const crt = tryCreateCrt(
      createContext({ compiles: true, texture: TEXTURE }),
    );

    expect([crt?.program, crt?.texture, crt?.vertices]).toEqual([
      PROGRAM,
      TEXTURE,
      BUFFER,
    ]);
  });

  it('should find the uniforms of the program when every part is made', () => {
    const crt = tryCreateCrt(
      createContext({ compiles: true, texture: TEXTURE }),
    );

    expect(crt?.uniforms.time).toEqual({ name: 'u_time' });
  });

  it('should give no monitor when the shaders do not compile', () => {
    expect(
      tryCreateCrt(createContext({ compiles: false, texture: TEXTURE })),
    ).toBeUndefined();
  });

  it('should give no monitor when the context cannot make a texture', () => {
    expect(
      tryCreateCrt(createContext({ compiles: true, texture: null })),
    ).toBeUndefined();
  });

  it('should give no monitor when there is no context', () => {
    expect(tryCreateCrt(undefined)).toBeUndefined();
  });
});
