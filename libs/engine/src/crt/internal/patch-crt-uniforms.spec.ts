import { tail } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Crt } from '../types/crt';
import { patchCrtUniforms } from './patch-crt-uniforms';

interface UniformCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const PROGRAM = Object.freeze({ name: 'program' });

const CRT = {
  program: PROGRAM,
  uniforms: {
    frame: 'frame',
    frameSize: 'frameSize',
    canvasSize: 'canvasSize',
    pixelSize: 'pixelSize',
    time: 'time',
  },
} as unknown as Crt;

const PICTURE = Object.freeze({
  bytes: new Uint8ClampedArray(0),
  width: 192,
  height: 128,
  pixelSize: 4,
});

const createContext = (calls: UniformCall[]): WebGLRenderingContext =>
  ({
    drawingBufferWidth: 768,
    drawingBufferHeight: 512,
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
  it('should call useProgram before it sets anything when it patches the uniforms', () => {
    const calls: UniformCall[] = [];

    patchCrtUniforms(createContext(calls), CRT, PICTURE, 1500);

    expect(calls[0]).toEqual({ name: 'useProgram', values: [PROGRAM] });
  });

  it('should pass the frame, the canvas, the pixel size, and the time to the shader when it patches the uniforms', () => {
    const calls: UniformCall[] = [];

    patchCrtUniforms(createContext(calls), CRT, PICTURE, 1500);

    expect(tail(calls)).toEqual([
      { name: 'uniform1i', values: ['frame', 0] },
      { name: 'uniform2f', values: ['frameSize', 192, 128] },
      { name: 'uniform2f', values: ['canvasSize', 768, 512] },
      { name: 'uniform1f', values: ['pixelSize', 4] },
      { name: 'uniform1f', values: ['time', 1500] },
    ]);
  });
});
