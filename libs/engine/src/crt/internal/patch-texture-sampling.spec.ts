import { describe, expect, it } from 'vitest';

import { patchTextureSampling } from './patch-texture-sampling';

interface TextureCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const TEXTURE_2D = 1;

const TEXTURE_MIN_FILTER = 2;

const TEXTURE_MAG_FILTER = 3;

const TEXTURE_WRAP_S = 4;

const TEXTURE_WRAP_T = 5;

const NEAREST = 6;

const CLAMP_TO_EDGE = 7;

const TEXTURE = Object.freeze({ name: 'texture' }) as unknown as WebGLTexture;

const createContext = (calls: TextureCall[]): WebGLRenderingContext =>
  ({
    TEXTURE_2D,
    TEXTURE_MIN_FILTER,
    TEXTURE_MAG_FILTER,
    TEXTURE_WRAP_S,
    TEXTURE_WRAP_T,
    NEAREST,
    CLAMP_TO_EDGE,
    bindTexture: (...values: unknown[]) =>
      calls.push({ name: 'bindTexture', values }),
    texParameteri: (...values: unknown[]) =>
      calls.push({ name: 'texParameteri', values }),
  }) as unknown as WebGLRenderingContext;

describe('patchTextureSampling', () => {
  it('should bind the texture and then read it as sharp, clamped pixels when it patches the sampling', () => {
    const calls: TextureCall[] = [];

    patchTextureSampling(createContext(calls), TEXTURE);

    expect(calls).toEqual([
      { name: 'bindTexture', values: [TEXTURE_2D, TEXTURE] },
      {
        name: 'texParameteri',
        values: [TEXTURE_2D, TEXTURE_MIN_FILTER, NEAREST],
      },
      {
        name: 'texParameteri',
        values: [TEXTURE_2D, TEXTURE_MAG_FILTER, NEAREST],
      },
      {
        name: 'texParameteri',
        values: [TEXTURE_2D, TEXTURE_WRAP_S, CLAMP_TO_EDGE],
      },
      {
        name: 'texParameteri',
        values: [TEXTURE_2D, TEXTURE_WRAP_T, CLAMP_TO_EDGE],
      },
    ]);
  });

  it('should return the very same texture when it patches the sampling', () => {
    expect(patchTextureSampling(createContext([]), TEXTURE)).toBe(TEXTURE);
  });
});
