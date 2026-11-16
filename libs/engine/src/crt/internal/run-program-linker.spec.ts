import { describe, expect, it } from 'vitest';

import { runProgramLinker } from './run-program-linker';

const PROGRAM = Object.freeze({ name: 'program' }) as unknown as WebGLProgram;

const createContext = (linked: unknown[]): WebGLRenderingContext =>
  ({
    linkProgram: (program: unknown) => linked.push(program),
  }) as unknown as WebGLRenderingContext;

describe('runProgramLinker', () => {
  it('should link the program when it runs the linker', () => {
    const linked: unknown[] = [];

    runProgramLinker(createContext(linked), PROGRAM);

    expect(linked).toEqual([PROGRAM]);
  });

  it('should return the very same program when it runs the linker', () => {
    expect(runProgramLinker(createContext([]), PROGRAM)).toBe(PROGRAM);
  });
});
