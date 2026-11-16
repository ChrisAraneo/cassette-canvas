import { describe, expect, it } from 'vitest';

import { writeTextureBinding } from './write-texture-binding';

const TEXTURE_2D = 1;

const TEXTURE = Object.freeze({ name: 'texture' }) as unknown as WebGLTexture;

const createContext = (calls: unknown[][]): WebGLRenderingContext =>
  ({
    TEXTURE_2D,
    bindTexture: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('writeTextureBinding', () => {
  it('should bind the texture as the two-dimensional texture when it writes the binding', () => {
    const calls: unknown[][] = [];

    writeTextureBinding(createContext(calls), TEXTURE);

    expect(calls).toEqual([[TEXTURE_2D, TEXTURE]]);
  });

  it('should return the very same texture when it writes the binding', () => {
    expect(writeTextureBinding(createContext([]), TEXTURE)).toBe(TEXTURE);
  });
});
