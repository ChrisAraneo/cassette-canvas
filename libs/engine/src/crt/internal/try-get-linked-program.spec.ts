import { runEffect } from '@cassette-canvas/common';
import { describe, expect, it } from 'vitest';

import { tryGetLinkedProgram } from './try-get-linked-program';

const LINK_STATUS = 3;

const PROGRAM = Object.freeze({ name: 'program' }) as unknown as WebGLProgram;

const createContext = (
  calls: unknown[][],
  links: boolean,
): WebGLRenderingContext =>
  ({
    LINK_STATUS,
    getProgramParameter: (...values: unknown[]) =>
      runEffect(links, () => calls.push(values)),
  }) as unknown as WebGLRenderingContext;

describe('tryGetLinkedProgram', () => {
  it('should return the program when it linked', () => {
    expect(tryGetLinkedProgram(createContext([], true), PROGRAM)).toBe(PROGRAM);
  });

  it('should return nothing when the program did not link', () => {
    expect(
      tryGetLinkedProgram(createContext([], false), PROGRAM),
    ).toBeUndefined();
  });

  it('should ask the program whether it linked when it reads the program', () => {
    const calls: unknown[][] = [];

    tryGetLinkedProgram(createContext(calls, true), PROGRAM);

    expect(calls).toEqual([[PROGRAM, LINK_STATUS]]);
  });
});
