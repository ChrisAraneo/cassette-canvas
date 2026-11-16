import { describe, expect, it } from 'vitest';

import type { CrtPicture } from '../types/crt-picture';
import { patchCrtTextureImage } from './patch-crt-texture-image';

const TEXTURE_2D = 1;

const RGBA = 9;

const UNSIGNED_BYTE = 10;

const BASE_MIPMAP_LEVEL = 0;

const NO_BORDER = 0;

const PICTURE_WIDTH = 2;

const PICTURE_HEIGHT = 1;

const createPicture = (): CrtPicture => ({
  bytes: new Uint8ClampedArray([1, 2, 3, 4, 5, 6, 7, 8]),
  width: PICTURE_WIDTH,
  height: PICTURE_HEIGHT,
  pixelSize: 4,
});

const createContext = (calls: unknown[][]): WebGLRenderingContext =>
  ({
    TEXTURE_2D,
    RGBA,
    UNSIGNED_BYTE,
    texImage2D: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('patchCrtTextureImage', () => {
  it('should upload the pixels of the picture as the texture image when it patches the image', () => {
    const calls: unknown[][] = [];

    patchCrtTextureImage(createContext(calls), createPicture());

    expect(calls).toEqual([
      [
        TEXTURE_2D,
        BASE_MIPMAP_LEVEL,
        RGBA,
        PICTURE_WIDTH,
        PICTURE_HEIGHT,
        NO_BORDER,
        RGBA,
        UNSIGNED_BYTE,
        new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
      ],
    ]);
  });

  it('should upload nothing when the picture holds no pixels', () => {
    const calls: unknown[][] = [];

    patchCrtTextureImage(createContext(calls), {
      ...createPicture(),
      bytes: new Uint8ClampedArray(0),
      width: 0,
      height: 0,
    });

    expect(calls).toEqual([
      [
        TEXTURE_2D,
        BASE_MIPMAP_LEVEL,
        RGBA,
        0,
        0,
        NO_BORDER,
        RGBA,
        UNSIGNED_BYTE,
        new Uint8Array(0),
      ],
    ]);
  });

  it('should return the very same context when it patches the image', () => {
    const context = createContext([]);

    expect(patchCrtTextureImage(context, createPicture())).toBe(context);
  });

  it('should not change the picture it was given when it patches the image', () => {
    const picture = createPicture();

    patchCrtTextureImage(createContext([]), picture);

    expect(picture).toEqual(createPicture());
  });
});
