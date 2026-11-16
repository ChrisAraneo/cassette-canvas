import { describe, expect, it } from 'vitest';

import { patchCrtViewport } from './patch-crt-viewport';

const CANVAS_WIDTH = 768;

const CANVAS_HEIGHT = 512;

const createContext = (
  calls: unknown[][],
  width: number,
  height: number,
): WebGLRenderingContext =>
  ({
    drawingBufferWidth: width,
    drawingBufferHeight: height,
    viewport: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('patchCrtViewport', () => {
  it('should cover the whole canvas from its top-left corner when it patches the viewport', () => {
    const calls: unknown[][] = [];

    patchCrtViewport(createContext(calls, CANVAS_WIDTH, CANVAS_HEIGHT));

    expect(calls).toEqual([[0, 0, CANVAS_WIDTH, CANVAS_HEIGHT]]);
  });

  it('should cover nothing when the canvas has no room', () => {
    const calls: unknown[][] = [];

    patchCrtViewport(createContext(calls, 0, 0));

    expect(calls).toEqual([[0, 0, 0, 0]]);
  });

  it('should return the very same context when it patches the viewport', () => {
    const context = createContext([], CANVAS_WIDTH, CANVAS_HEIGHT);

    expect(patchCrtViewport(context)).toBe(context);
  });
});
