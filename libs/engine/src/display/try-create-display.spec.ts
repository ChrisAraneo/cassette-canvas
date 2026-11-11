import { runEffect } from '@cassette-canvas/common';
import { keys, noop, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CRT_CONTEXT_ATTRIBUTES } from '../crt/consts';
import type { PaletteColors } from '../palette/types/palette-colors';
import { tryCreateDisplay } from './try-create-display';

const COLORS: PaletteColors = [
  '#7f7f7f',
  '#d23c3c',
  '#e07a2e',
  '#e6c23a',
  '#98c93c',
  '#3d9e4a',
  '#2e9c8f',
  '#3bb4d6',
  '#4a8fe0',
  '#3c56c8',
  '#5b42c2',
  '#8a45c8',
  '#c045b4',
  '#e0608f',
  '#8c5a36',
  '#d4a373',
];

const SETTINGS = Object.freeze({ colors: COLORS, pixelSize: 4, spriteSize: 8 });

const createContext = (compiles: boolean): WebGLRenderingContext =>
  ({
    createProgram: () => ({ name: 'program' }),
    createShader: () => ({ name: 'shader' }),
    shaderSource: noop,
    compileShader: noop,
    getShaderParameter: () => compiles,
    attachShader: noop,
    bindAttribLocation: noop,
    linkProgram: noop,
    getProgramParameter: () => true,
    createTexture: () => ({ name: 'texture' }),
    bindTexture: noop,
    texParameteri: noop,
    createBuffer: () => ({ name: 'buffer' }),
    bindBuffer: noop,
    bufferData: noop,
    getUniformLocation: (_: unknown, name: string) => ({ name }),
  }) as unknown as WebGLRenderingContext;

const createCanvas = (
  context: WebGLRenderingContext | null,
  requests: unknown[][] = [],
): HTMLCanvasElement =>
  ({
    width: 64,
    height: 48,
    getContext: (...values: unknown[]) =>
      runEffect(context, () => requests.push(values)),
  }) as unknown as HTMLCanvasElement;

describe('tryCreateDisplay', () => {
  it('should count the logical pixels of the canvas when every part is ready', () => {
    const display = tryCreateDisplay(
      createCanvas(createContext(true)),
      SETTINGS,
    );

    expect([display?.width, display?.height]).toEqual([16, 12]);
  });

  it('should hold all the extended colors when every part is ready', () => {
    const display = tryCreateDisplay(
      createCanvas(createContext(true)),
      SETTINGS,
    );

    expect(size(keys(display?.palette))).toBe(512);
  });

  it('should set up the monitor effect when every part is ready', () => {
    const display = tryCreateDisplay(
      createCanvas(createContext(true)),
      SETTINGS,
    );

    expect(display?.crt.uniforms.time).toEqual({ name: 'u_time' });
  });

  it('should ask the canvas for a WebGL context without smoothing or depth', () => {
    const requests: unknown[][] = [];

    tryCreateDisplay(createCanvas(createContext(true), requests), SETTINGS);

    expect(requests).toEqual([['webgl', CRT_CONTEXT_ATTRIBUTES]]);
  });

  it('should give no display when the canvas has no WebGL context', () => {
    expect(tryCreateDisplay(createCanvas(null), SETTINGS)).toBeUndefined();
  });

  it('should give no display when the monitor shaders do not compile', () => {
    expect(
      tryCreateDisplay(createCanvas(createContext(false)), SETTINGS),
    ).toBeUndefined();
  });

  it('should give no display when the pixel size is zero', () => {
    expect(
      tryCreateDisplay(createCanvas(createContext(true)), {
        ...SETTINGS,
        pixelSize: 0,
      }),
    ).toBeUndefined();
  });

  it('should give no display when the sprite size is negative', () => {
    expect(
      tryCreateDisplay(createCanvas(createContext(true)), {
        ...SETTINGS,
        spriteSize: -8,
      }),
    ).toBeUndefined();
  });
});
