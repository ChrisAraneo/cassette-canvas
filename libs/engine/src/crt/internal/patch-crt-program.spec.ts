import { describe, expect, it } from 'vitest';

import type { Crt } from '../types/crt';
import { patchCrtProgram } from './patch-crt-program';

const PROGRAM = Object.freeze({ name: 'program' });

const createCrt = (): Crt => ({ program: PROGRAM }) as unknown as Crt;

const createContext = (started: unknown[]): WebGLRenderingContext =>
  ({
    useProgram: (program: unknown) => started.push(program),
  }) as unknown as WebGLRenderingContext;

describe('patchCrtProgram', () => {
  it('should start the shader program when it patches the program', () => {
    const started: unknown[] = [];

    patchCrtProgram(createContext(started), createCrt());

    expect(started).toEqual([PROGRAM]);
  });

  it('should return the very same context when it patches the program', () => {
    const context = createContext([]);

    expect(patchCrtProgram(context, createCrt())).toBe(context);
  });

  it('should not change the monitor it was given when it patches the program', () => {
    const crt = createCrt();

    patchCrtProgram(createContext([]), crt);

    expect(crt).toEqual(createCrt());
  });
});
