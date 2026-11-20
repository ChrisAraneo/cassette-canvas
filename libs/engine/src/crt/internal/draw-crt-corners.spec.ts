import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { drawCrtCorners } from './draw-crt-corners';

const TRIANGLES = 3;

const FIRST_CORNER = 0;

const CORNER_COUNT = 3;

const createContext = (calls: unknown[][]): WebGLRenderingContext =>
  ({
    TRIANGLES,
    drawArrays: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('drawCrtCorners', () => {
  it('should draw the three corners of one triangle when it draws the corners', () => {
    const calls: unknown[][] = [];

    drawCrtCorners(createContext(calls));

    expect(calls).toEqual([[TRIANGLES, FIRST_CORNER, CORNER_COUNT]]);
  });

  it('should draw only once when it draws the corners', () => {
    const calls: unknown[][] = [];

    drawCrtCorners(createContext(calls));

    expect(size(calls)).toBe(1);
  });
});
