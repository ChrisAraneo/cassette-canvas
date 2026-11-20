import { describe, expect, it } from 'vitest';

import type { Crt } from '../types/crt';
import { patchCrtFrameUniform } from './patch-crt-frame-uniform';

const FRAME_TEXTURE_UNIT = 0;

const createCrt = (): Crt =>
  ({ uniforms: { frame: 'frame' } }) as unknown as Crt;

const createContext = (calls: unknown[][]): WebGLRenderingContext =>
  ({
    uniform1i: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('patchCrtFrameUniform', () => {
  it('should point the shader at the first texture unit when it patches the frame', () => {
    const calls: unknown[][] = [];

    patchCrtFrameUniform(createContext(calls), createCrt());

    expect(calls).toEqual([['frame', FRAME_TEXTURE_UNIT]]);
  });

  it('should return the very same context when it patches the frame', () => {
    const context = createContext([]);

    expect(patchCrtFrameUniform(context, createCrt())).toBe(context);
  });

  it('should not change the monitor it was given when it patches the frame', () => {
    const crt = createCrt();

    patchCrtFrameUniform(createContext([]), crt);

    expect(crt).toEqual(createCrt());
  });
});
