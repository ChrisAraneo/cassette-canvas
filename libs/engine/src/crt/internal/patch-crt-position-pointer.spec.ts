import { describe, expect, it } from 'vitest';

import { POSITION_LOCATION } from '../consts';
import { patchCrtPositionPointer } from './patch-crt-position-pointer';

const FLOAT = 2;

const VALUES_PER_CORNER = 2;

const PACKED_STRIDE = 0;

const NO_OFFSET = 0;

const createContext = (calls: unknown[][]): WebGLRenderingContext =>
  ({
    FLOAT,
    vertexAttribPointer: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('patchCrtPositionPointer', () => {
  it('should read two packed floats per corner from the start of the buffer when it patches the position pointer', () => {
    const calls: unknown[][] = [];

    patchCrtPositionPointer(createContext(calls));

    expect(calls).toEqual([
      [
        POSITION_LOCATION,
        VALUES_PER_CORNER,
        FLOAT,
        false,
        PACKED_STRIDE,
        NO_OFFSET,
      ],
    ]);
  });

  it('should return the very same context when it patches the position pointer', () => {
    const context = createContext([]);

    expect(patchCrtPositionPointer(context)).toBe(context);
  });
});
