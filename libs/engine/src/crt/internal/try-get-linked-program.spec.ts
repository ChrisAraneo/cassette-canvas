import { runEffect } from '@cassette-canvas/common';
import { describe, expect, it } from 'vitest';

import { tryGetLinkedProgram } from './try-get-linked-program';

const LINK_STATUS = 3;

const PROGRAM = Object.freeze({ name: 'program' }) as unknown as WebGLProgram;

const createContext = (
  links: boolean,
  asked: unknown[][],
): WebGLRenderingContext =>
  ({
    LINK_STATUS,
    getProgramParameter: (...values: unknown[]) =>
      runEffect(links, () => asked.push(values)),
  }) as unknown as WebGLRenderingContext;

describe('tryGetLinkedProgram', () => {
  it('should return the program when it linked', () => {
    expect(tryGetLinkedProgram(createContext(true, []), PROGRAM)).toBe(PROGRAM);
  });

  it('should return nothing when the program did not link', () => {
    expect(
      tryGetLinkedProgram(createContext(false, []), PROGRAM),
    ).toBeUndefined();
  });

  it('should ask the program whether it linked when it reads the program', () => {
    const asked: unknown[][] = [];

    tryGetLinkedProgram(createContext(true, asked), PROGRAM);

    expect(asked).toEqual([[PROGRAM, LINK_STATUS]]);
  });
});
