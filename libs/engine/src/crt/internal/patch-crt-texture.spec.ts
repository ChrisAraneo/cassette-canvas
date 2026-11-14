import { describe, expect, it } from 'vitest';

import type { Crt } from '../types/crt';
import { patchCrtTexture } from './patch-crt-texture';

interface TextureCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const TEXTURE = Object.freeze({ name: 'texture' });

const CRT = { texture: TEXTURE } as unknown as Crt;

const BYTES = Uint8ClampedArray.from([10, 20, 30, 255, 40, 50, 60, 255]);

const createContext = (calls: TextureCall[]): WebGLRenderingContext =>
  ({
    TEXTURE_2D: 1,
    RGBA: 2,
    UNSIGNED_BYTE: 3,
    bindTexture: (...values: unknown[]) =>
      calls.push({ name: 'bindTexture', values }),
    texImage2D: (...values: unknown[]) =>
      calls.push({ name: 'texImage2D', values }),
  }) as unknown as WebGLRenderingContext;

describe('patchCrtTexture', () => {
  it('should upload the frame bytes into the texture at logical resolution when it patches it', () => {
    const calls: TextureCall[] = [];

    patchCrtTexture(createContext(calls), CRT, {
      bytes: BYTES,
      width: 2,
      height: 1,
      pixelSize: 4,
    });

    expect(calls).toEqual([
      { name: 'bindTexture', values: [1, TEXTURE] },
      {
        name: 'texImage2D',
        values: [1, 0, 2, 2, 1, 0, 2, 3, Uint8Array.from(BYTES)],
      },
    ]);
  });

  it('should return the very same context when it patches the texture', () => {
    const context = createContext([]);

    expect(
      patchCrtTexture(context, CRT, {
        bytes: BYTES,
        width: 2,
        height: 1,
        pixelSize: 4,
      }),
    ).toBe(context);
  });
});
