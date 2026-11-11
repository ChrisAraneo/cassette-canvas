import { describe, expect, it } from 'vitest';

import { FULL_SCREEN_TRIANGLE } from '../consts';
import { tryCreateVertices } from './try-create-vertices';

interface BufferCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const BUFFER = Object.freeze({ name: 'buffer' });

const createContext = (
  calls: BufferCall[],
  buffer: object | null,
): WebGLRenderingContext =>
  ({
    ARRAY_BUFFER: 1,
    STATIC_DRAW: 2,
    createBuffer: () => buffer,
    bindBuffer: (...values: unknown[]) =>
      calls.push({ name: 'bindBuffer', values }),
    bufferData: (...values: unknown[]) =>
      calls.push({ name: 'bufferData', values }),
  }) as unknown as WebGLRenderingContext;

describe('tryCreateVertices', () => {
  it('should give the buffer when the context can make one', () => {
    expect(tryCreateVertices(createContext([], BUFFER))).toBe(BUFFER);
  });

  it('should fill the buffer with one triangle that covers the whole screen', () => {
    const calls: BufferCall[] = [];

    tryCreateVertices(createContext(calls, BUFFER));

    expect(calls).toEqual([
      { name: 'bindBuffer', values: [1, BUFFER] },
      {
        name: 'bufferData',
        values: [1, new Float32Array(FULL_SCREEN_TRIANGLE), 2],
      },
    ]);
  });

  it('should give no buffer when the context cannot make one', () => {
    expect(tryCreateVertices(createContext([], null))).toBeUndefined();
  });
});
