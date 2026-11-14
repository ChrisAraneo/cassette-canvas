import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { tryCreateTexture } from './try-create-texture';

interface TextureCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const TEXTURE = Object.freeze({ name: 'texture' });

const createContext = (
  calls: TextureCall[],
  texture: object | null,
): WebGLRenderingContext =>
  ({
    TEXTURE_2D: 1,
    TEXTURE_MIN_FILTER: 2,
    TEXTURE_MAG_FILTER: 3,
    TEXTURE_WRAP_S: 4,
    TEXTURE_WRAP_T: 5,
    NEAREST: 6,
    CLAMP_TO_EDGE: 7,
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
      [1, TEXTURE],
      [1, 2, 6],
      [1, 3, 6],
      [1, 4, 7],
      [1, 5, 7],
    ]);
  });

  it('should return undefined when the context cannot make one', () => {
    expect(tryCreateTexture(createContext([], null))).toBeUndefined();
  });
});
