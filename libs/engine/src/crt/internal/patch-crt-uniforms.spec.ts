import { tail } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Crt } from '../types/crt';
import type { CrtPicture } from '../types/crt-picture';
import { patchCrtUniforms } from './patch-crt-uniforms';

interface UniformCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const PROGRAM = Object.freeze({ name: 'program' });

const UNIFORMS = Object.freeze({
  frame: 'frame',
  frameSize: 'frameSize',
  canvasSize: 'canvasSize',
  pixelSize: 'pixelSize',
  time: 'time',
});

const CRT = {
  program: PROGRAM,
  uniforms: UNIFORMS,
} as unknown as Crt;

const PICTURE: CrtPicture = Object.freeze({
  bytes: new Uint8ClampedArray(0),
  width: 192,
  height: 128,
  pixelSize: 4,
});

const TIME = 1500;

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
      { name: 'uniform1i', values: ['frame', 0] },
      { name: 'uniform2f', values: ['frameSize', 192, 128] },
      { name: 'uniform2f', values: ['canvasSize', 768, 512] },
      { name: 'uniform1f', values: ['pixelSize', 4] },
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
    patchCrtUniforms({
      context: createContext([]),
      crt: CRT,
      picture: PICTURE,
      time: TIME,
    });

    expect([CRT, PICTURE]).toEqual([
      { program: PROGRAM, uniforms: UNIFORMS },
      {
        bytes: new Uint8ClampedArray(0),
        width: 192,
        height: 128,
        pixelSize: 4,
      },
    ]);
  });
});
