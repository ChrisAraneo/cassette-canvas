import { runEffect } from '@cassette-canvas/common';
import { describe, expect, it } from 'vitest';

import { CRT_CONTEXT_ATTRIBUTES } from '../../crt/consts';
import type { PaletteColors } from '../../palette/types/palette-colors';
import type { DisplaySettings } from '../types/display-settings';
import { initializeDisplayContext } from './initialize-display-context';

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

const PIXEL_SIZE = 4;

const SPRITE_SIZE = 8;

const SETTINGS: DisplaySettings = Object.freeze({
  colors: COLORS,
  pixelSize: PIXEL_SIZE,
  spriteSize: SPRITE_SIZE,
});

const CONTEXT = Object.freeze({
  name: 'context',
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

describe('initializeDisplayContext', () => {
  it('should return the context of the canvas when the canvas has one', () => {
    expect(
      initializeDisplayContext({
        canvas: createCanvas(CONTEXT),
        settings: SETTINGS,
      }).context,
    ).toBe(CONTEXT);
  });

  it('should ask the canvas for a WebGL surface without smoothing or depth when it reads the context', () => {
    const requests: unknown[][] = [];

    initializeDisplayContext({
      canvas: createCanvas(CONTEXT, requests),
      settings: SETTINGS,
    });

    expect(requests).toEqual([['webgl', CRT_CONTEXT_ATTRIBUTES]]);
  });

  it('should return no context at all when the canvas has none', () => {
    expect(
      initializeDisplayContext({
        canvas: createCanvas(null),
        settings: SETTINGS,
      }).context,
    ).toBeUndefined();
  });

  it('should return the very same canvas when it reads the context', () => {
    const canvas = createCanvas(CONTEXT);

    expect(
      initializeDisplayContext({ canvas, settings: SETTINGS }).canvas,
    ).toBe(canvas);
  });

  it('should return the very same settings when it reads the context', () => {
    expect(
      initializeDisplayContext({
        canvas: createCanvas(CONTEXT),
        settings: SETTINGS,
      }).settings,
    ).toBe(SETTINGS);
  });
});
