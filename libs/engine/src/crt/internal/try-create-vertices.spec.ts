import { describe, expect, it } from 'vitest';

import { FULL_SCREEN_TRIANGLE } from '../consts';
import { tryCreateVertices } from './try-create-vertices';

interface BufferCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const BUFFER = Object.freeze({ name: 'buffer' });

const ARRAY_BUFFER = 1;

const STATIC_DRAW = 2;

const createContext = (
  calls: BufferCall[],
  buffer: object | null,
): WebGLRenderingContext =>
  ({
    ARRAY_BUFFER,
    STATIC_DRAW,
    createBuffer: () => buffer,
    bindBuffer: (...values: unknown[]) =>
      calls.push({ name: 'bindBuffer', values }),
    bufferData: (...values: unknown[]) =>
      calls.push({ name: 'bufferData', values }),
  }) as unknown as WebGLRenderingContext;

describe('tryCreateVertices', () => {
  it('should return the buffer when the context can make one', () => {
    expect(tryCreateVertices(createContext([], BUFFER))).toBe(BUFFER);
  });

  it('should set the buffer to one triangle that covers the whole screen when it creates one', () => {
    const calls: BufferCall[] = [];

    tryCreateVertices(createContext(calls, BUFFER));

    expect(calls).toEqual([
      { name: 'bindBuffer', values: [ARRAY_BUFFER, BUFFER] },
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

  it('should return no buffer when the context cannot make one', () => {
    expect(tryCreateVertices(createContext([], null))).toBeUndefined();
  });
});
