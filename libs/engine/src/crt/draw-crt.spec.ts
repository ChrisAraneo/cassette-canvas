import { fromPairs, last, map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { drawCrt } from './draw-crt';
import type { Crt } from './types/crt';

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

const CRT = {
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
} as unknown as Crt;

const PICTURE = Object.freeze({
  bytes: Uint8ClampedArray.from([10, 20, 30, 255]),
  width: 1,
  height: 1,
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
  it('should upload the frame, set up the shader and then draw', () => {
    const calls: CrtCall[] = [];

    drawCrt(createContext(calls), CRT, PICTURE, 1500);

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

  it('should hand the time to the shader so the grain moves', () => {
    const calls: CrtCall[] = [];

    drawCrt(createContext(calls), CRT, PICTURE, 1500);

    expect(calls[7]?.values).toEqual(['time', 1500]);
  });

  it('should draw last when it shows the frame', () => {
    const calls: CrtCall[] = [];

    drawCrt(createContext(calls), CRT, PICTURE, 0);

    expect(last(calls)?.name).toBe('drawArrays');
  });
});
