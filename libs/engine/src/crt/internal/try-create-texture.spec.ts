import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { tryCreateTexture } from './try-create-texture';

interface TextureCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const TEXTURE = Object.freeze({ name: 'texture' });

const TEXTURE_2D = 1;

const TEXTURE_MIN_FILTER = 2;

const TEXTURE_MAG_FILTER = 3;

const TEXTURE_WRAP_S = 4;

const TEXTURE_WRAP_T = 5;

const NEAREST = 6;

const CLAMP_TO_EDGE = 7;

const createContext = (
  calls: TextureCall[],
  texture: object | null,
): WebGLRenderingContext =>
  ({
    TEXTURE_2D,
    TEXTURE_MIN_FILTER,
    TEXTURE_MAG_FILTER,
    TEXTURE_WRAP_S,
    TEXTURE_WRAP_T,
    NEAREST,
    CLAMP_TO_EDGE,
    createTexture: () => texture,
    bindTexture: (...values: unknown[]) =>
      calls.push({ name: 'bindTexture', values }),
    texParameteri: (...values: unknown[]) =>
      calls.push({ name: 'texParameteri', values }),
  }) as unknown as WebGLRenderingContext;

describe('tryCreateTexture', () => {
  it('should return the texture when the context can make one', () => {
    expect(tryCreateTexture(createContext([], TEXTURE))).toBe(TEXTURE);
  });

  it('should set the texture to read the nearest pixel and stop at the edges when it creates one', () => {
    const calls: TextureCall[] = [];

    tryCreateTexture(createContext(calls, TEXTURE));

    expect(map(calls, (call) => call.values)).toEqual([
      [TEXTURE_2D, TEXTURE],
      [TEXTURE_2D, TEXTURE_MIN_FILTER, NEAREST],
      [TEXTURE_2D, TEXTURE_MAG_FILTER, NEAREST],
      [TEXTURE_2D, TEXTURE_WRAP_S, CLAMP_TO_EDGE],
      [TEXTURE_2D, TEXTURE_WRAP_T, CLAMP_TO_EDGE],
    ]);
  });

  it('should return no texture when the context cannot make one', () => {
    expect(tryCreateTexture(createContext([], null))).toBeUndefined();
  });
});
