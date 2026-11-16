import { describe, expect, it } from 'vitest';

import type { Crt } from '../types/crt';
import type { CrtPicture } from '../types/crt-picture';
import { patchCrtPixelSizeUniform } from './patch-crt-pixel-size-uniform';

const PIXEL_SIZE = 4;

const createCrt = (): Crt =>
  ({ uniforms: { pixelSize: 'pixelSize' } }) as unknown as Crt;

const createPicture = (): CrtPicture => ({
  bytes: new Uint8ClampedArray(0),
  width: 192,
  height: 128,
  pixelSize: PIXEL_SIZE,
});

const createContext = (calls: unknown[][]): WebGLRenderingContext =>
  ({
    uniform1f: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('patchCrtPixelSizeUniform', () => {
  it('should pass how wide one pixel is to the shader when it patches the pixel size', () => {
    const calls: unknown[][] = [];

    patchCrtPixelSizeUniform(
      createContext(calls),
      createCrt(),
      createPicture(),
    );

    expect(calls).toEqual([['pixelSize', PIXEL_SIZE]]);
  });

  it('should return the very same context when it patches the pixel size', () => {
    const context = createContext([]);

    expect(
      patchCrtPixelSizeUniform(context, createCrt(), createPicture()),
    ).toBe(context);
  });

  it('should not change the monitor or the picture it was given when it patches the pixel size', () => {
    const crt = createCrt();
    const picture = createPicture();

    patchCrtPixelSizeUniform(createContext([]), crt, picture);

    expect([crt, picture]).toEqual([createCrt(), createPicture()]);
  });
});
