import { describe, expect, it } from 'vitest';

import { POSITION_ATTRIBUTE, POSITION_LOCATION } from '../consts';
import { writePositionLocation } from './write-position-location';

const PROGRAM = Object.freeze({ name: 'program' }) as unknown as WebGLProgram;

const createContext = (calls: unknown[][]): WebGLRenderingContext =>
  ({
    bindAttribLocation: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('writePositionLocation', () => {
  it('should bind the position attribute to its location when it writes the location', () => {
    const calls: unknown[][] = [];

    writePositionLocation(createContext(calls), PROGRAM);

    expect(calls).toEqual([[PROGRAM, POSITION_LOCATION, POSITION_ATTRIBUTE]]);
  });

  it('should return the very same program when it writes the location', () => {
    expect(writePositionLocation(createContext([]), PROGRAM)).toBe(PROGRAM);
  });
});
