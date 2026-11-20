import { describe, expect, it } from 'vitest';

import { POSITION_LOCATION } from '../consts';
import type { Crt } from '../types/crt';
import { drawCrtTriangle } from './draw-crt-triangle';

interface DrawCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const ARRAY_BUFFER = 1;

const FLOAT = 2;

const TRIANGLES = 3;

const CANVAS_WIDTH = 768;

const CANVAS_HEIGHT = 512;

const VALUES_PER_CORNER = 2;

const PACKED_STRIDE = 0;

const FIRST_VALUE_OFFSET = 0;

const FIRST_CORNER = 0;

const CORNER_COUNT = 3;

const VERTICES = Object.freeze({ name: 'vertices' });

const CRT = { vertices: VERTICES } as unknown as Crt;

const createContext = (calls: DrawCall[]): WebGLRenderingContext =>
  ({
    ARRAY_BUFFER,
    FLOAT,
    TRIANGLES,
    drawingBufferWidth: CANVAS_WIDTH,
    drawingBufferHeight: CANVAS_HEIGHT,
    viewport: (...values: unknown[]) =>
      calls.push({ name: 'viewport', values }),
    bindBuffer: (...values: unknown[]) =>
      calls.push({ name: 'bindBuffer', values }),
    enableVertexAttribArray: (...values: unknown[]) =>
      calls.push({ name: 'enableVertexAttribArray', values }),
    vertexAttribPointer: (...values: unknown[]) =>
      calls.push({ name: 'vertexAttribPointer', values }),
    drawArrays: (...values: unknown[]) =>
      calls.push({ name: 'drawArrays', values }),
  }) as unknown as WebGLRenderingContext;

describe('drawCrtTriangle', () => {
  it('should draw one triangle that covers the whole canvas when it draws the monitor', () => {
    const calls: DrawCall[] = [];

    drawCrtTriangle({ context: createContext(calls), crt: CRT });

    expect(calls).toEqual([
      { name: 'viewport', values: [0, 0, CANVAS_WIDTH, CANVAS_HEIGHT] },
      { name: 'bindBuffer', values: [ARRAY_BUFFER, VERTICES] },
      { name: 'enableVertexAttribArray', values: [POSITION_LOCATION] },
      {
        name: 'vertexAttribPointer',
        values: [
          POSITION_LOCATION,
          VALUES_PER_CORNER,
          FLOAT,
          false,
          PACKED_STRIDE,
          FIRST_VALUE_OFFSET,
        ],
      },
      {
        name: 'drawArrays',
        values: [TRIANGLES, FIRST_CORNER, CORNER_COUNT],
      },
    ]);
  });
});
