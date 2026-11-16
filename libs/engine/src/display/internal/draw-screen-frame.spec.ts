import { find, fromPairs, map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Crt } from '../../crt/types/crt';
import { toLitPixel } from '../../palette/to-lit-pixel';
import type { Palette } from '../../palette/types/palette';
import type { Screen } from '../../screen/types/screen';
import type { Display } from '../types/display';
import { drawScreenFrame } from './draw-screen-frame';

interface GlCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const UPLOAD_WIDTH_INDEX = 3;

const UPLOAD_HEIGHT_INDEX = 4;

const UPLOAD_BYTES_INDEX = 8;

const METHODS = Object.freeze([
  'bindTexture',
  'texImage2D',
  'useProgram',
  'uniform1i',
  'uniform1f',
  'uniform2f',
  'viewport',
  'bindBuffer',
  'enableVertexAttribArray',
  'vertexAttribPointer',
  'drawArrays',
]);

const CRT = {
  program: { name: 'program' },
  texture: { name: 'texture' },
  vertices: { name: 'buffer' },
  uniforms: {
    frame: 'frame',
    frameSize: 'frameSize',
    canvasSize: 'canvasSize',
    pixelSize: 'pixelSize',
    time: 'time',
  },
} as unknown as Crt;

const PALETTE: Palette = Object.freeze({
  [toLitPixel(0x14, 0)]: { red: 200, green: 40, blue: 40 },
  [toLitPixel(0x94, 0)]: { red: 20, green: 30, blue: 90 },
});

const createStubDisplay = (calls: GlCall[]): Display => ({
  context: {
    drawingBufferWidth: 6,
    drawingBufferHeight: 3,
    ...fromPairs(
      map(METHODS, (name) => [
        name,
        (...values: unknown[]) => calls.push({ name, values }),
      ]),
    ),
  } as unknown as WebGLRenderingContext,
  crt: CRT,
  palette: PALETTE,
  pixelSize: 3,
  spriteSize: 1,
  width: 2,
  height: 1,
  fps: 50,
  drawnAt: 0,
});

const DRAW_TIME = 20;

const createHeroScreen = (): Screen => ({
  background: 0x94,
  ambient: 0,
  sprites: [
    { id: 'hero', sprite: [0x14], row: 0, column: 1, castsShadow: false },
  ],
  lights: [],
  overlays: [],
});

const findUpload = (calls: GlCall[]): readonly unknown[] | undefined =>
  find(calls, (call) => call.name === 'texImage2D')?.values;

describe('drawScreenFrame', () => {
  it('should upload the composed frame at logical resolution when it draws a frame', () => {
    const calls: GlCall[] = [];

    drawScreenFrame(createStubDisplay(calls), createHeroScreen(), DRAW_TIME);

    expect(findUpload(calls)?.[UPLOAD_WIDTH_INDEX]).toBe(2);
    expect(findUpload(calls)?.[UPLOAD_HEIGHT_INDEX]).toBe(1);
    expect(findUpload(calls)?.[UPLOAD_BYTES_INDEX]).toEqual(
      Uint8Array.from([20, 30, 90, 255, 200, 40, 40, 255]),
    );
  });

  it('should upload the background alone when the screen holds no sprites', () => {
    const calls: GlCall[] = [];

    drawScreenFrame(
      createStubDisplay(calls),
      { ...createHeroScreen(), sprites: [] },
      DRAW_TIME,
    );

    expect(findUpload(calls)?.[UPLOAD_BYTES_INDEX]).toEqual(
      Uint8Array.from([20, 30, 90, 255, 20, 30, 90, 255]),
    );
  });

  it('should pass the time to the monitor effect when it draws a frame, so the grain moves', () => {
    const calls: GlCall[] = [];

    drawScreenFrame(createStubDisplay(calls), createHeroScreen(), 2500);

    expect(find(calls, (call) => call.values[0] === 'time')?.values[1]).toBe(
      2500,
    );
  });

  it('should return the display carrying the time of the frame when it draws a frame', () => {
    const display = createStubDisplay([]);

    expect(drawScreenFrame(display, createHeroScreen(), DRAW_TIME)).toEqual({
      ...display,
      drawnAt: DRAW_TIME,
    });
  });

  it('should draw the frame when the display has drawn nothing yet', () => {
    const calls: GlCall[] = [];

    drawScreenFrame(
      { ...createStubDisplay(calls), drawnAt: Number.NEGATIVE_INFINITY },
      createHeroScreen(),
      0,
    );

    expect(findUpload(calls)?.[UPLOAD_WIDTH_INDEX]).toBe(2);
  });

  it('should not change the old screen when it draws a frame', () => {
    const screen = createHeroScreen();

    drawScreenFrame(createStubDisplay([]), screen, DRAW_TIME);

    expect(screen).toEqual(createHeroScreen());
  });
});
