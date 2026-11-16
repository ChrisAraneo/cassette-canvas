import { describe, expect, it } from 'vitest';

import type { Crt } from '../types/crt';
import { patchCrtVertexBuffer } from './patch-crt-vertex-buffer';

const ARRAY_BUFFER = 1;

const VERTICES = Object.freeze({ name: 'vertices' });

const createCrt = (): Crt => ({ vertices: VERTICES }) as unknown as Crt;

const createContext = (calls: unknown[][]): WebGLRenderingContext =>
  ({
    ARRAY_BUFFER,
    bindBuffer: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('patchCrtVertexBuffer', () => {
  it('should bind the corners of the monitor as the array buffer when it patches the vertex buffer', () => {
    const calls: unknown[][] = [];

    patchCrtVertexBuffer(createContext(calls), createCrt());

    expect(calls).toEqual([[ARRAY_BUFFER, VERTICES]]);
  });

  it('should return the very same context when it patches the vertex buffer', () => {
    const context = createContext([]);

    expect(patchCrtVertexBuffer(context, createCrt())).toBe(context);
  });

  it('should not change the monitor it was given when it patches the vertex buffer', () => {
    const crt = createCrt();

    patchCrtVertexBuffer(createContext([]), crt);

    expect(crt).toEqual(createCrt());
  });
});
