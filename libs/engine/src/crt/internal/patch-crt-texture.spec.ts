import { describe, expect, it } from 'vitest';

import type { Crt } from '../types/crt';
import type { CrtPicture } from '../types/crt-picture';
import { patchCrtTexture } from './patch-crt-texture';

interface TextureCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const TEXTURE_2D = 1;

const RGBA = 2;

const UNSIGNED_BYTE = 3;

const BASE_MIPMAP_LEVEL = 0;

const NO_BORDER = 0;

const PICTURE_WIDTH = 2;

const PICTURE_HEIGHT = 1;

const PIXEL_SIZE = 4;

const TEXTURE = Object.freeze({ name: 'texture' });

const createCrt = (): Crt => ({ texture: TEXTURE }) as unknown as Crt;

const CRT = Object.freeze(createCrt());

const BYTES = Uint8ClampedArray.from([10, 20, 30, 255, 40, 50, 60, 255]);

const createPicture = (): CrtPicture => ({
  bytes: BYTES,
  width: PICTURE_WIDTH,
  height: PICTURE_HEIGHT,
  pixelSize: PIXEL_SIZE,
});

const PICTURE: CrtPicture = Object.freeze(createPicture());

const TIME = 1500;

const createContext = (calls: TextureCall[]): WebGLRenderingContext =>
  ({
    TEXTURE_2D,
    RGBA,
    UNSIGNED_BYTE,
    bindTexture: (...values: unknown[]) =>
      calls.push({ name: 'bindTexture', values }),
    texImage2D: (...values: unknown[]) =>
      calls.push({ name: 'texImage2D', values }),
  }) as unknown as WebGLRenderingContext;

describe('patchCrtTexture', () => {
  it('should upload the frame bytes into the texture at logical resolution when it patches it', () => {
    const calls: TextureCall[] = [];

    patchCrtTexture({
      context: createContext(calls),
      crt: CRT,
      picture: PICTURE,
      time: TIME,
    });

    expect(calls).toEqual([
      { name: 'bindTexture', values: [TEXTURE_2D, TEXTURE] },
      {
        name: 'texImage2D',
        values: [
          TEXTURE_2D,
          BASE_MIPMAP_LEVEL,
          RGBA,
          PICTURE_WIDTH,
          PICTURE_HEIGHT,
          NO_BORDER,
          RGBA,
          UNSIGNED_BYTE,
          Uint8Array.from(BYTES),
        ],
      },
    ]);
  });

  it('should return the very same context when it patches the texture', () => {
    const context = createContext([]);

    expect(
      patchCrtTexture({ context, crt: CRT, picture: PICTURE, time: TIME })
        .context,
    ).toBe(context);
  });

  it('should return the very same monitor when it patches the texture', () => {
    expect(
      patchCrtTexture({
        context: createContext([]),
        crt: CRT,
        picture: PICTURE,
        time: TIME,
      }).crt,
    ).toBe(CRT);
  });

  it('should return the very same picture when it patches the texture', () => {
    expect(
      patchCrtTexture({
        context: createContext([]),
        crt: CRT,
        picture: PICTURE,
        time: TIME,
      }).picture,
    ).toBe(PICTURE);
  });

  it('should return the time it was given when it patches the texture', () => {
    expect(
      patchCrtTexture({
        context: createContext([]),
        crt: CRT,
        picture: PICTURE,
        time: TIME,
      }).time,
    ).toBe(TIME);
  });

  it('should not change the monitor or the picture it was given when it patches the texture', () => {
    const crt = createCrt();
    const picture = createPicture();

    patchCrtTexture({ context: createContext([]), crt, picture, time: TIME });

    expect([crt, picture]).toEqual([createCrt(), createPicture()]);
  });
});
