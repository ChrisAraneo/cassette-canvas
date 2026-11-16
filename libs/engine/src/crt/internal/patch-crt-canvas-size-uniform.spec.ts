import { describe, expect, it } from 'vitest';

import type { Crt } from '../types/crt';
import { patchCrtCanvasSizeUniform } from './patch-crt-canvas-size-uniform';

const CANVAS_WIDTH = 768;

const CANVAS_HEIGHT = 512;

const createCrt = (): Crt =>
  ({ uniforms: { canvasSize: 'canvasSize' } }) as unknown as Crt;

const createContext = (
  calls: unknown[][],
  width: number,
  height: number,
): WebGLRenderingContext =>
  ({
    drawingBufferWidth: width,
    drawingBufferHeight: height,
    uniform2f: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('patchCrtCanvasSizeUniform', () => {
  it('should pass the size of the drawing buffer to the shader when it patches the canvas size', () => {
    const calls: unknown[][] = [];

    patchCrtCanvasSizeUniform(
      createContext(calls, CANVAS_WIDTH, CANVAS_HEIGHT),
      createCrt(),
    );

    expect(calls).toEqual([['canvasSize', CANVAS_WIDTH, CANVAS_HEIGHT]]);
  });

  it('should pass no size when the canvas has no room', () => {
    const calls: unknown[][] = [];

    patchCrtCanvasSizeUniform(createContext(calls, 0, 0), createCrt());

    expect(calls).toEqual([['canvasSize', 0, 0]]);
  });

  it('should return the very same context when it patches the canvas size', () => {
    const context = createContext([], CANVAS_WIDTH, CANVAS_HEIGHT);

    expect(patchCrtCanvasSizeUniform(context, createCrt())).toBe(context);
  });

  it('should not change the monitor it was given when it patches the canvas size', () => {
    const crt = createCrt();

    patchCrtCanvasSizeUniform(
      createContext([], CANVAS_WIDTH, CANVAS_HEIGHT),
      crt,
    );

    expect(crt).toEqual(createCrt());
  });
});
