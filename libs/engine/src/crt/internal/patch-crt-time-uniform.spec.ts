import { describe, expect, it } from 'vitest';

import type { Crt } from '../types/crt';
import { patchCrtTimeUniform } from './patch-crt-time-uniform';

const TIME = 1500;

const createCrt = (): Crt => ({ uniforms: { time: 'time' } }) as unknown as Crt;

const createContext = (calls: unknown[][]): WebGLRenderingContext =>
  ({
    uniform1f: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('patchCrtTimeUniform', () => {
  it('should pass how long the monitor has run to the shader when it patches the time', () => {
    const calls: unknown[][] = [];

    patchCrtTimeUniform(createContext(calls), createCrt(), TIME);

    expect(calls).toEqual([['time', TIME]]);
  });

  it('should pass no time when the monitor has just started', () => {
    const calls: unknown[][] = [];

    patchCrtTimeUniform(createContext(calls), createCrt(), 0);

    expect(calls).toEqual([['time', 0]]);
  });

  it('should return the very same context when it patches the time', () => {
    const context = createContext([]);

    expect(patchCrtTimeUniform(context, createCrt(), TIME)).toBe(context);
  });

  it('should not change the monitor it was given when it patches the time', () => {
    const crt = createCrt();

    patchCrtTimeUniform(createContext([]), crt, TIME);

    expect(crt).toEqual(createCrt());
  });
});
