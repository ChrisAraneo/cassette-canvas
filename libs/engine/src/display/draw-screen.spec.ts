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
});

const createHeroScreen = (): Screen => ({
  background: 0x94,
  ambient: 0,
  sprites: [
    { id: 'hero', sprite: [0x14], row: 0, column: 1, castsShadow: false },
  ],
  lights: [],
});

const findUpload = (calls: GlCall[]): readonly unknown[] | undefined =>
  find(calls, (call) => call.name === 'texImage2D')?.values;

describe('drawScreen', () => {
  it('should upload the composed frame at logical resolution when it draws the screen', () => {
    const calls: GlCall[] = [];

    drawScreen(createStubDisplay(calls), createHeroScreen(), 0);

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
      0,
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
      0,
    );

    expect(findUpload(calls)?.[8]).toEqual(new Uint8Array(2 * BYTES_PER_PIXEL));
  });

  it('should hand the time to the monitor effect so the grain moves', () => {
    const calls: GlCall[] = [];

    drawScreen(createStubDisplay(calls), createHeroScreen(), 2500);

    expect(find(calls, (call) => call.values[0] === 'time')?.values[1]).toBe(
      2500,
    );
  });

  it('should tell the monitor effect how large a pixel is', () => {
    const calls: GlCall[] = [];

    drawScreen(createStubDisplay(calls), createHeroScreen(), 0);

    expect(
      find(calls, (call) => call.values[0] === 'pixelSize')?.values[1],
    ).toBe(3);
  });

  it('should give back the very same display when it draws the screen', () => {
    const display = createStubDisplay([]);

    expect(drawScreen(display, createHeroScreen(), 0)).toBe(display);
  });

  it('should not change the old screen when it draws it', () => {
    const screen = createHeroScreen();

    drawScreen(createStubDisplay([]), screen, 0);

    expect(screen).toEqual(createHeroScreen());
  });
});
