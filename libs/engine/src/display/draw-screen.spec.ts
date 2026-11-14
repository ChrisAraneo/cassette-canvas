import { find, fromPairs, map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Crt } from '../crt/types/crt';
import { TRANSPARENT } from '../palette/consts';
import { toLitPixel } from '../palette/to-lit-pixel';
import type { Palette } from '../palette/types/palette';
import type { Screen } from '../screen/types/screen';
import { drawScreen } from './draw-screen';
import type { Display } from './types/display';

interface GlCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const BYTES_PER_PIXEL = 4;

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
  [toLitPixel(0x14, -1)]: { red: 160, green: 30, blue: 30 },
  [toLitPixel(0x14, 0)]: { red: 200, green: 40, blue: 40 },
  [toLitPixel(0x94, -1)]: { red: 15, green: 25, blue: 70 },
  [toLitPixel(0x94, 0)]: { red: 20, green: 30, blue: 90 },
});

/** A display that draws 50 frames a second, so one frame lasts 20 ms. */
const createStubDisplay = (calls: GlCall[], drawnAt = 0): Display => ({
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
  drawnAt,
});

/** A time far enough after the last frame for the next one to be due. */
const DUE_TIME = 20;

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

describe('drawScreen', () => {
  it('should upload the composed frame at logical resolution when it draws the screen', () => {
    const calls: GlCall[] = [];

    drawScreen(createStubDisplay(calls), createHeroScreen(), DUE_TIME);

    expect(findUpload(calls)?.[3]).toBe(2);
    expect(findUpload(calls)?.[4]).toBe(1);
    expect(findUpload(calls)?.[8]).toEqual(
      Uint8Array.from([20, 30, 90, 255, 200, 40, 40, 255]),
    );
  });

  it('should upload the lit colors when the screen is darkened by one extended shade', () => {
    const calls: GlCall[] = [];

    drawScreen(
      createStubDisplay(calls),
      { ...createHeroScreen(), ambient: -1 },
      DUE_TIME,
    );

    expect(findUpload(calls)?.[8]).toEqual(
      Uint8Array.from([15, 25, 70, 255, 160, 30, 30, 255]),
    );
  });

  it('should upload clear pixels when the screen has a transparent background and no sprites', () => {
    const calls: GlCall[] = [];

    drawScreen(
      createStubDisplay(calls),
      { ...createHeroScreen(), background: TRANSPARENT, sprites: [] },
      DUE_TIME,
    );

    expect(findUpload(calls)?.[8]).toEqual(new Uint8Array(2 * BYTES_PER_PIXEL));
  });

  it('should pass the time to the monitor effect when it draws the screen, so the grain moves', () => {
    const calls: GlCall[] = [];

    drawScreen(createStubDisplay(calls), createHeroScreen(), 2500);

    expect(find(calls, (call) => call.values[0] === 'time')?.values[1]).toBe(
      2500,
    );
  });

  it('should pass the pixel size to the monitor effect when it draws the screen', () => {
    const calls: GlCall[] = [];

    drawScreen(createStubDisplay(calls), createHeroScreen(), DUE_TIME);

    expect(
      find(calls, (call) => call.values[0] === 'pixelSize')?.values[1],
    ).toBe(3);
  });

  it('should return the display carrying the time of the frame when it draws the screen', () => {
    const display = createStubDisplay([]);

    expect(drawScreen(display, createHeroScreen(), DUE_TIME)).toEqual({
      ...display,
      drawnAt: DUE_TIME,
    });
  });

  it('should not change the old screen when it draws it', () => {
    const screen = createHeroScreen();

    drawScreen(createStubDisplay([]), screen, DUE_TIME);

    expect(screen).toEqual(createHeroScreen());
  });

  it('should draw nothing when the frame comes sooner than the display rate allows', () => {
    const calls: GlCall[] = [];

    drawScreen(createStubDisplay(calls), createHeroScreen(), 19);

    expect(calls).toEqual([]);
  });

  it('should return the very same display when it skips a frame', () => {
    const display = createStubDisplay([]);

    expect(drawScreen(display, createHeroScreen(), 19)).toBe(display);
  });

  it('should draw the frame when the display has drawn nothing yet', () => {
    const calls: GlCall[] = [];

    drawScreen(
      createStubDisplay(calls, Number.NEGATIVE_INFINITY),
      createHeroScreen(),
      0,
    );

    expect(findUpload(calls)?.[3]).toBe(2);
  });
});
