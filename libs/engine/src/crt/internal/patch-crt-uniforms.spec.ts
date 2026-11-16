import { tail } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Crt } from '../types/crt';
import type { CrtPicture } from '../types/crt-picture';
import { patchCrtUniforms } from './patch-crt-uniforms';

interface UniformCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const PICTURE_WIDTH = 192;

const PICTURE_HEIGHT = 128;

const PIXEL_SIZE = 4;

const CANVAS_WIDTH = 768;

const CANVAS_HEIGHT = 512;

const FIRST_TEXTURE_UNIT = 0;

const PROGRAM = Object.freeze({ name: 'program' });

const UNIFORMS = Object.freeze({
  frame: 'frame',
  frameSize: 'frameSize',
  canvasSize: 'canvasSize',
  pixelSize: 'pixelSize',
  time: 'time',
});

const createCrt = (): Crt =>
  ({ program: PROGRAM, uniforms: UNIFORMS }) as unknown as Crt;

const CRT = Object.freeze(createCrt());

const createPicture = (): CrtPicture => ({
  bytes: new Uint8ClampedArray(0),
  width: PICTURE_WIDTH,
  height: PICTURE_HEIGHT,
  pixelSize: PIXEL_SIZE,
});

const PICTURE: CrtPicture = Object.freeze(createPicture());

const TIME = 1500;

const createContext = (calls: UniformCall[]): WebGLRenderingContext =>
  ({
    drawingBufferWidth: CANVAS_WIDTH,
    drawingBufferHeight: CANVAS_HEIGHT,
    useProgram: (...values: unknown[]) =>
      calls.push({ name: 'useProgram', values }),
    uniform1i: (...values: unknown[]) =>
      calls.push({ name: 'uniform1i', values }),
    uniform1f: (...values: unknown[]) =>
      calls.push({ name: 'uniform1f', values }),
    uniform2f: (...values: unknown[]) =>
      calls.push({ name: 'uniform2f', values }),
  }) as unknown as WebGLRenderingContext;

describe('patchCrtUniforms', () => {
  it('should start the shader program before it sets anything when it patches the uniforms', () => {
    const calls: UniformCall[] = [];

    patchCrtUniforms({
      context: createContext(calls),
      crt: CRT,
      picture: PICTURE,
      time: TIME,
    });

    expect(calls[0]).toEqual({ name: 'useProgram', values: [PROGRAM] });
  });

  it('should pass the frame, the canvas, the pixel size, and the time to the shader when it patches the uniforms', () => {
    const calls: UniformCall[] = [];

    patchCrtUniforms({
      context: createContext(calls),
      crt: CRT,
      picture: PICTURE,
      time: TIME,
    });

    expect(tail(calls)).toEqual([
      { name: 'uniform1i', values: ['frame', FIRST_TEXTURE_UNIT] },
      {
        name: 'uniform2f',
        values: ['frameSize', PICTURE_WIDTH, PICTURE_HEIGHT],
      },
      {
        name: 'uniform2f',
        values: ['canvasSize', CANVAS_WIDTH, CANVAS_HEIGHT],
      },
      { name: 'uniform1f', values: ['pixelSize', PIXEL_SIZE] },
      { name: 'uniform1f', values: ['time', TIME] },
    ]);
  });

  it('should return the very same context when it patches the uniforms', () => {
    const context = createContext([]);

    expect(
      patchCrtUniforms({ context, crt: CRT, picture: PICTURE, time: TIME })
        .context,
    ).toBe(context);
  });

  it('should return the very same monitor when it patches the uniforms', () => {
    expect(
      patchCrtUniforms({
        context: createContext([]),
        crt: CRT,
        picture: PICTURE,
        time: TIME,
      }).crt,
    ).toBe(CRT);
  });

  it('should not change the monitor or the picture it was given when it patches the uniforms', () => {
    const crt = createCrt();
    const picture = createPicture();

    patchCrtUniforms({ context: createContext([]), crt, picture, time: TIME });

    expect([crt, picture]).toEqual([createCrt(), createPicture()]);
  });
});
