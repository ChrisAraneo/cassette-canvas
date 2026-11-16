import { describe, expect, it } from 'vitest';

import { FULL_SCREEN_TRIANGLE } from '../consts';
import { writeVerticesData } from './write-vertices-data';

const ARRAY_BUFFER = 1;

const STATIC_DRAW = 8;

const VERTICES = Object.freeze({ name: 'vertices' }) as unknown as WebGLBuffer;

const createContext = (calls: unknown[][]): WebGLRenderingContext =>
  ({
    ARRAY_BUFFER,
    STATIC_DRAW,
    bufferData: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('writeVerticesData', () => {
  it('should upload the corners of the full-screen triangle when it writes the data', () => {
    const calls: unknown[][] = [];

    writeVerticesData(createContext(calls), VERTICES);

    expect(calls).toEqual([
      [ARRAY_BUFFER, new Float32Array(FULL_SCREEN_TRIANGLE), STATIC_DRAW],
    ]);
  });

  it('should return the very same buffer when it writes the data', () => {
    expect(writeVerticesData(createContext([]), VERTICES)).toBe(VERTICES);
  });
});
