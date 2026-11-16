import { describe, expect, it } from 'vitest';

import type { Crt } from '../types/crt';
import type { CrtPicture } from '../types/crt-picture';
import { patchCrtFrameSizeUniform } from './patch-crt-frame-size-uniform';

const PICTURE_WIDTH = 192;

const PICTURE_HEIGHT = 128;

const PIXEL_SIZE = 4;

const createCrt = (): Crt =>
  ({ uniforms: { frameSize: 'frameSize' } }) as unknown as Crt;

const createPicture = (): CrtPicture => ({
  bytes: new Uint8ClampedArray(0),
  width: PICTURE_WIDTH,
  height: PICTURE_HEIGHT,
  pixelSize: PIXEL_SIZE,
});

const createContext = (calls: unknown[][]): WebGLRenderingContext =>
  ({
    uniform2f: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('patchCrtFrameSizeUniform', () => {
  it('should pass the size of the picture to the shader when it patches the frame size', () => {
    const calls: unknown[][] = [];

    patchCrtFrameSizeUniform(
      createContext(calls),
      createCrt(),
      createPicture(),
    );

    expect(calls).toEqual([['frameSize', PICTURE_WIDTH, PICTURE_HEIGHT]]);
  });

  it('should pass no size when the picture is empty', () => {
    const calls: unknown[][] = [];

    patchCrtFrameSizeUniform(createContext(calls), createCrt(), {
      ...createPicture(),
      width: 0,
      height: 0,
    });

    expect(calls).toEqual([['frameSize', 0, 0]]);
  });

  it('should return the very same context when it patches the frame size', () => {
    const context = createContext([]);

    expect(
      patchCrtFrameSizeUniform(context, createCrt(), createPicture()),
    ).toBe(context);
  });

  it('should not change the monitor or the picture it was given when it patches the frame size', () => {
    const crt = createCrt();
    const picture = createPicture();

    patchCrtFrameSizeUniform(createContext([]), crt, picture);

    expect([crt, picture]).toEqual([createCrt(), createPicture()]);
  });
});
