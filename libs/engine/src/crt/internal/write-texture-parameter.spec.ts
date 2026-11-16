import { describe, expect, it } from 'vitest';

import { writeTextureParameter } from './write-texture-parameter';

const TEXTURE_2D = 1;

const TEXTURE_MIN_FILTER = 2;

const NEAREST = 6;

const TEXTURE = Object.freeze({ name: 'texture' }) as unknown as WebGLTexture;

const createContext = (calls: unknown[][]): WebGLRenderingContext =>
  ({
    TEXTURE_2D,
    texParameteri: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('writeTextureParameter', () => {
  it('should set the parameter on the two-dimensional texture when it writes a parameter', () => {
    const calls: unknown[][] = [];

    writeTextureParameter(
      createContext(calls),
      TEXTURE,
      TEXTURE_MIN_FILTER,
      NEAREST,
    );

    expect(calls).toEqual([[TEXTURE_2D, TEXTURE_MIN_FILTER, NEAREST]]);
  });

  it('should return the very same texture when it writes a parameter', () => {
    expect(
      writeTextureParameter(
        createContext([]),
        TEXTURE,
        TEXTURE_MIN_FILTER,
        NEAREST,
      ),
    ).toBe(TEXTURE);
  });
});
