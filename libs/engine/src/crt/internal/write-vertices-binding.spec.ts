import { describe, expect, it } from 'vitest';

import { writeVerticesBinding } from './write-vertices-binding';

const ARRAY_BUFFER = 1;

const VERTICES = Object.freeze({ name: 'vertices' }) as unknown as WebGLBuffer;

const createContext = (calls: unknown[][]): WebGLRenderingContext =>
  ({
    ARRAY_BUFFER,
    bindBuffer: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('writeVerticesBinding', () => {
  it('should bind the corners as the array buffer when it writes the binding', () => {
    const calls: unknown[][] = [];

    writeVerticesBinding(createContext(calls), VERTICES);

    expect(calls).toEqual([[ARRAY_BUFFER, VERTICES]]);
  });

  it('should return the very same buffer when it writes the binding', () => {
    expect(writeVerticesBinding(createContext([]), VERTICES)).toBe(VERTICES);
  });
});
