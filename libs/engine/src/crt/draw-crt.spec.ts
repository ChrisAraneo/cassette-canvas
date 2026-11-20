import { fromPairs, last, map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { drawCrt } from './draw-crt';
import type { Crt } from './types/crt';
import type { CrtPicture } from './types/crt-picture';

interface CrtCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const METHODS = Object.freeze([
  'bindTexture',
  'texImage2D',
  'useProgram',
  'uniform1i',
  'uniform1f',
  'uniform2f',
  'viewport',
  'bindBuffer',
  'enableVertexAttribArray',
  'vertexAttribPointer',
  'drawArrays',
]);

const createCrt = (): Crt =>
  ({
    program: { name: 'program' },
    texture: { name: 'texture' },
    vertices: { name: 'buffer' },
    uniforms: {
      frame: 'frame',
      frameSize: 'frameSize',
      canvasSize: 'canvasSize',
      pixelSize: 'pixelSize',
      time: 'time',
    },
  }) as unknown as Crt;

const CRT = createCrt();

const TIME = 1500;

const TIME_CALL_INDEX = 7;

const createPicture = (): CrtPicture => ({
  bytes: Uint8ClampedArray.from([10, 20, 30, 255]),
  width: 1,
  height: 1,
  pixelSize: 4,
});

const PICTURE = Object.freeze(createPicture());

const EMPTY_PICTURE: CrtPicture = Object.freeze({
  bytes: Uint8ClampedArray.from([]),
  width: 0,
  height: 0,
  pixelSize: 4,
});

const createContext = (calls: CrtCall[]): WebGLRenderingContext =>
  ({
    drawingBufferWidth: 4,
    drawingBufferHeight: 4,
    ...fromPairs(
      map(METHODS, (name) => [
        name,
        (...values: unknown[]) => calls.push({ name, values }),
      ]),
    ),
  }) as unknown as WebGLRenderingContext;

describe('drawCrt', () => {
  it('should upload the frame, set up the shader, and then draw when it shows a picture', () => {
    const calls: CrtCall[] = [];

    drawCrt(createContext(calls), CRT, PICTURE, TIME);

    expect(map(calls, (call) => call.name)).toEqual([
      'bindTexture',
      'texImage2D',
      'useProgram',
      'uniform1i',
      'uniform2f',
      'uniform2f',
      'uniform1f',
      'uniform1f',
      'viewport',
      'bindBuffer',
      'enableVertexAttribArray',
      'vertexAttribPointer',
      'drawArrays',
    ]);
  });

  it('should pass the time to the shader when it draws, so the grain moves', () => {
    const calls: CrtCall[] = [];

    drawCrt(createContext(calls), CRT, PICTURE, TIME);

    expect(calls[TIME_CALL_INDEX]?.values).toEqual(['time', TIME]);
  });

  it('should draw the triangle last when it shows the frame', () => {
    const calls: CrtCall[] = [];

    drawCrt(createContext(calls), CRT, PICTURE, TIME);

    expect(last(calls)?.name).toBe('drawArrays');
  });

  it('should still set the shader up and draw when the picture holds no pixels', () => {
    const calls: CrtCall[] = [];

    drawCrt(createContext(calls), CRT, EMPTY_PICTURE, TIME);

    expect(last(calls)?.name).toBe('drawArrays');
  });

  it('should not change the monitor or the picture it was given when it shows a frame', () => {
    const crt = createCrt();
    const picture = createPicture();

    drawCrt(createContext([]), crt, picture, TIME);

    expect([crt, picture]).toEqual([createCrt(), createPicture()]);
  });
});
