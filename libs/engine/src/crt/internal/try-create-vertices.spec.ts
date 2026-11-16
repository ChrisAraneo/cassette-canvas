import { describe, expect, it } from 'vitest';

import { FULL_SCREEN_TRIANGLE } from '../consts';
import { tryCreateVertices } from './try-create-vertices';

interface VerticesCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const VERTICES = Object.freeze({ name: 'vertices' });

const ARRAY_BUFFER = 1;

const STATIC_DRAW = 2;

const createContext = (
  calls: VerticesCall[],
  vertices: object | null,
): WebGLRenderingContext =>
  ({
    ARRAY_BUFFER,
    STATIC_DRAW,
    createBuffer: () => vertices,
    bindBuffer: (...values: unknown[]) =>
      calls.push({ name: 'bindBuffer', values }),
    bufferData: (...values: unknown[]) =>
      calls.push({ name: 'bufferData', values }),
  }) as unknown as WebGLRenderingContext;

describe('tryCreateVertices', () => {
  it('should return the vertices when the context can make them', () => {
    expect(tryCreateVertices(createContext([], VERTICES))).toBe(VERTICES);
  });

  it('should set the vertices to one triangle that covers the whole screen when it creates them', () => {
    const calls: VerticesCall[] = [];

    tryCreateVertices(createContext(calls, VERTICES));

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

  it('should return no vertices when the context cannot make them', () => {
    expect(tryCreateVertices(createContext([], null))).toBeUndefined();
  });
});
