import { describe, expect, it } from 'vitest';

import type { Crt } from '../types/crt';
import { patchCrtTextureBinding } from './patch-crt-texture-binding';

const TEXTURE_2D = 1;

const TEXTURE = Object.freeze({ name: 'texture' });

const createCrt = (): Crt => ({ texture: TEXTURE }) as unknown as Crt;

const createContext = (calls: unknown[][]): WebGLRenderingContext =>
  ({
    TEXTURE_2D,
    bindTexture: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('patchCrtTextureBinding', () => {
  it('should bind the frame texture of the monitor when it patches the binding', () => {
    const calls: unknown[][] = [];

    patchCrtTextureBinding(createContext(calls), createCrt());

    expect(calls).toEqual([[TEXTURE_2D, TEXTURE]]);
  });

  it('should return the very same context when it patches the binding', () => {
    const context = createContext([]);

    expect(patchCrtTextureBinding(context, createCrt())).toBe(context);
  });

  it('should not change the monitor it was given when it patches the binding', () => {
    const crt = createCrt();

    patchCrtTextureBinding(createContext([]), crt);

    expect(crt).toEqual(createCrt());
  });
});
