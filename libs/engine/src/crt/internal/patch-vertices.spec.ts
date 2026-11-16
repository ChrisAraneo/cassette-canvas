import { describe, expect, it } from 'vitest';

import { FULL_SCREEN_TRIANGLE } from '../consts';
import { patchVertices } from './patch-vertices';

interface VerticesCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const ARRAY_BUFFER = 1;

const STATIC_DRAW = 8;

const VERTICES = Object.freeze({ name: 'vertices' }) as unknown as WebGLBuffer;

const createContext = (calls: VerticesCall[]): WebGLRenderingContext =>
  ({
    ARRAY_BUFFER,
    STATIC_DRAW,
    bindBuffer: (...values: unknown[]) =>
      calls.push({ name: 'bindBuffer', values }),
    bufferData: (...values: unknown[]) =>
      calls.push({ name: 'bufferData', values }),
  }) as unknown as WebGLRenderingContext;

describe('patchVertices', () => {
  it('should bind the buffer before it uploads the corners when it patches the corners', () => {
    const calls: VerticesCall[] = [];

    patchVertices(createContext(calls), VERTICES);

    expect(calls).toEqual([
      { name: 'bindBuffer', values: [ARRAY_BUFFER, VERTICES] },
      {
        name: 'bufferData',
        values: [
          ARRAY_BUFFER,
          new Float32Array(FULL_SCREEN_TRIANGLE),
          STATIC_DRAW,
        ],
      },
    ]);
  });

  it('should return the very same buffer when it patches the corners', () => {
    expect(patchVertices(createContext([]), VERTICES)).toBe(VERTICES);
  });
});
