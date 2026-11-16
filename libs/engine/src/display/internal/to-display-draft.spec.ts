import { keys, noop, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { COLOR_COUNT, EXTENDED_SHADE_COUNT } from '../../palette/consts';
import type { PaletteColors } from '../../palette/types/palette-colors';
import { DEFAULT_MAX_FPS } from '../consts';
import type { DisplaySettings } from '../types/display-settings';
import { toDisplayDraft } from './to-display-draft';

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

const SCREEN_WIDTH = 192;

const SCREEN_HEIGHT = 128;

const SIZE = Object.freeze({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });

const createSettings = (): DisplaySettings => ({
  colors: COLORS,
  pixelSize: PIXEL_SIZE,
  spriteSize: SPRITE_SIZE,
});

const createContext = (): WebGLRenderingContext =>
  ({
    createProgram: () => ({ name: 'program' }),
    createShader: () => ({ name: 'shader' }),
    shaderSource: noop,
    compileShader: noop,
    getShaderParameter: () => true,
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

describe('toDisplayDraft', () => {
  it('should carry the size, the pixel size and the sprite size when it drafts a display', () => {
    const draft = toDisplayDraft(createContext(), SIZE, createSettings());

    expect([
      draft.width,
      draft.height,
      draft.pixelSize,
      draft.spriteSize,
    ]).toEqual([SCREEN_WIDTH, SCREEN_HEIGHT, PIXEL_SIZE, SPRITE_SIZE]);
  });

  it('should carry the very same context when it drafts a display', () => {
    const context = createContext();

    expect(toDisplayDraft(context, SIZE, createSettings()).context).toBe(
      context,
    );
  });

  it('should carry the monitor effect when the context can set one up', () => {
    expect(
      toDisplayDraft(createContext(), SIZE, createSettings()).crt,
    ).toBeDefined();
  });

  it('should carry no monitor effect when there is no context at all', () => {
    expect(
      toDisplayDraft(undefined, SIZE, createSettings()).crt,
    ).toBeUndefined();
  });

  it('should carry the palette expanded from the base colors when it drafts a display', () => {
    expect(
      size(
        keys(toDisplayDraft(createContext(), SIZE, createSettings()).palette),
      ),
    ).toBe(COLOR_COUNT * EXTENDED_SHADE_COUNT);
  });

  it('should carry the default frame rate when the settings name no limit', () => {
    expect(toDisplayDraft(createContext(), SIZE, createSettings()).fps).toBe(
      DEFAULT_MAX_FPS,
    );
  });

  it('should carry the frame rate the settings name when they name one', () => {
    expect(
      toDisplayDraft(createContext(), SIZE, { ...createSettings(), fps: 30 })
        .fps,
    ).toBe(30);
  });

  it('should have drawn nothing yet when it drafts a display', () => {
    expect(
      toDisplayDraft(createContext(), SIZE, createSettings()).drawnAt,
    ).toBe(Number.NEGATIVE_INFINITY);
  });

  it('should not change the settings it was given when it drafts a display', () => {
    const settings = createSettings();

    toDisplayDraft(createContext(), SIZE, settings);

    expect(settings).toEqual(createSettings());
  });
});
