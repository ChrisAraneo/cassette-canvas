import { describe, expect, it } from 'vitest';

import { POSITION_LOCATION } from '../consts';
import type { Crt } from '../types/crt';
import { drawCrtTriangle } from './draw-crt-triangle';

interface DrawCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const BUFFER = Object.freeze({ name: 'buffer' });

const CRT = { vertices: BUFFER } as unknown as Crt;

const createContext = (calls: DrawCall[]): WebGLRenderingContext =>
  ({
    ARRAY_BUFFER: 1,
    FLOAT: 2,
    TRIANGLES: 3,
    drawingBufferWidth: 768,
    drawingBufferHeight: 512,
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

    drawCrtTriangle(createContext(calls), CRT);

    expect(calls).toEqual([
      { name: 'viewport', values: [0, 0, 768, 512] },
      { name: 'bindBuffer', values: [1, BUFFER] },
      { name: 'enableVertexAttribArray', values: [POSITION_LOCATION] },
      {
        name: 'vertexAttribPointer',
        values: [POSITION_LOCATION, 2, 2, false, 0, 0],
      },
      { name: 'drawArrays', values: [3, 0, 3] },
    ]);
  });
});
