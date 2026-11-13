import { chunk, includes, invert, join, map, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LIGHTEST_EXTENDED_SHADE, TRANSPARENT } from '../palette/consts';
import { toExtendedPixel } from '../palette/to-extended-pixel';
import { toLitPixel } from '../palette/to-lit-pixel';
import { createOverlay } from '../overlay/create-overlay';
import type { OverlayPlacement } from '../overlay/types/overlay-placement';
import { toSprite } from '../screen/to-sprite';
import type { Light } from '../screen/types/light';
import type { Screen } from '../screen/types/screen';
import type { SpritePlacement } from '../screen/types/sprite-placement';
import { computeFrame } from './compute-frame';
import type { Frame } from './types/frame';

const BACKGROUND = 0x94;

const SPRITE_PIXELS: Readonly<Record<string, number>> = Object.freeze({
  r: 0x14,
  g: 0x54,
  w: 0x34,
});

const LIT_PIXELS: Readonly<Record<string, number>> = Object.freeze({
  '.': TRANSPARENT,
  r: toLitPixel(0x14, 0),
  g: toLitPixel(0x54, 0),
  b: toLitPixel(BACKGROUND, 0),
  L: toLitPixel(0x00, 4),
  D: toLitPixel(0x00, 0),
  W: toLitPixel(0x34, 4),
});

const SYMBOLS = invert(LIT_PIXELS);

const RED_CORNER = toSprite(['rr', 'r.'], SPRITE_PIXELS);

const GREEN_BLOCK = toSprite(['gg', 'gg'], SPRITE_PIXELS);

const WALL = toSprite(['.w.', '.w.', '.w.'], SPRITE_PIXELS);

const SUN: Light = Object.freeze({
  id: 'sun',
  row: 1,
  column: 0,
  radius: 1000,
  intensity: 4,
});

const formatFrame = (frame: Frame, width: number): string[] =>
  map(chunk(frame, width), (row) =>
    join(
      map(row, (pixel) => SYMBOLS[pixel] ?? '?'),
      '',
    ),
  );

const placeSprite = (
  id: string,
  sprite: readonly number[],
  row: number,
  column: number,
): SpritePlacement => ({ id, sprite, row, column, castsShadow: false });

const placeOverlay = (
  pixel: number,
  row: number,
  column: number,
): OverlayPlacement => ({
  id: 'panel',
  overlay: createOverlay(1, 1, pixel),
  row,
  column,
});

const createLayeredScreen = (): Screen => ({
  background: BACKGROUND,
  ambient: 0,
  sprites: [
    placeSprite('corner', RED_CORNER, 0, 0),
    placeSprite('block', GREEN_BLOCK, 1, 1),
  ],
  lights: [],
  overlays: [],
});

const createWallScreen = (castsShadow: boolean): Screen => ({
  background: 0x00,
  ambient: 0,
  sprites: [{ ...placeSprite('wall', WALL, 0, 2), castsShadow }],
  lights: [SUN],
  overlays: [],
});

const createGrayScreen = (ambient: number): Screen => ({
  background: 0x04,
  ambient,
  sprites: [],
  lights: [],
  overlays: [],
});

const GRAY_RAMP = toSprite(['abcd'], {
  a: 0x00,
  b: 0x01,
  c: 0x02,
  d: 0x03,
});

/** The four darkest gray shades under one even light across the frame. */
const createRampScreen = (ambient: number, intensity: number): Screen => ({
  background: TRANSPARENT,
  ambient,
  sprites: [placeSprite('ramp', GRAY_RAMP, 0, 0)],
  lights: [{ id: 'lamp', row: 0, column: 2, radius: 1000, intensity }],
  overlays: [],
});

describe('computeFrame', () => {
  it('should draw the later sprite over the earlier one when they overlap', () => {
    const frame = computeFrame(createLayeredScreen(), 2, 4, 3);

    expect(formatFrame(frame, 4)).toEqual(['rrbb', 'rggb', 'bggb']);
  });

  it('should let the sprite below show through when a pixel is transparent', () => {
    const frame = computeFrame(
      {
        ...createLayeredScreen(),
        sprites: [
          placeSprite('block', GREEN_BLOCK, 0, 0),
          placeSprite('corner', RED_CORNER, 0, 0),
        ],
      },
      2,
      2,
      2,
    );

    expect(formatFrame(frame, 2)).toEqual(['rr', 'rg']);
  });

  it('should clip the sprites when they hang over the edges', () => {
    const frame = computeFrame(
      {
        ...createLayeredScreen(),
        sprites: [
          placeSprite('top-left', GREEN_BLOCK, -1, -1),
          placeSprite('bottom-right', RED_CORNER, 2, 3),
        ],
      },
      2,
      4,
      3,
    );

    expect(formatFrame(frame, 4)).toEqual(['gbbb', 'bbbb', 'bbbr']);
  });

  it('should show only the background when the screen holds no sprites', () => {
    const frame = computeFrame(
      { ...createLayeredScreen(), sprites: [] },
      2,
      3,
      2,
    );

    expect(formatFrame(frame, 3)).toEqual(['bbb', 'bbb']);
  });

  it('should land on a darker sprite shade when the ambient light takes away four extended shades per shade', () => {
    expect(computeFrame(createGrayScreen(-8), 1, 3, 1)).toEqual(
      times(3, () => toLitPixel(0x02, 0)),
    );
  });

  it('should darken in steps finer than a sprite shade when the ambient light is not a multiple of four', () => {
    expect(computeFrame(createGrayScreen(-2), 1, 3, 1)).toEqual(
      times(3, () => toExtendedPixel(0, 15)),
    );
  });

  it('should fade the light from a bright core when a light shines', () => {
    const frame = computeFrame(
      {
        background: 0x00,
        ambient: 0,
        sprites: [],
        lights: [{ id: 'torch', row: 0, column: 0, radius: 4, intensity: 4 }],
        overlays: [],
      },
      1,
      5,
      1,
    );

    expect(frame).toEqual(
      map([5, 4, 2, 1, 1], (extendedShade) =>
        toExtendedPixel(0, extendedShade),
      ),
    );
  });

  it('should keep the sprite shades apart when a lamp shines on a bright scene', () => {
    const frame = computeFrame(createRampScreen(8, 16), 4, 4, 1);

    expect(uniq(frame)).toHaveLength(4);
  });

  it('should leave the lightest extended shade for light brighter than this when a lamp shines on a bright scene', () => {
    const frame = computeFrame(createRampScreen(8, 16), 4, 4, 1);

    expect(includes(frame, toExtendedPixel(0, LIGHTEST_EXTENDED_SHADE))).toBe(
      false,
    );
  });

  it('should cast a shadow behind a sprite when the sprite casts shadows', () => {
    const frame = computeFrame(createWallScreen(true), 3, 7, 3);

    expect(formatFrame(frame, 7)).toEqual(['LLLWDDD', 'LLLWDDD', 'LLLWDDD']);
  });

  it('should let the light through when the sprite casts no shadow', () => {
    const frame = computeFrame(createWallScreen(false), 3, 7, 3);

    expect(formatFrame(frame, 7)).toEqual(['LLLWLLL', 'LLLWLLL', 'LLLWLLL']);
  });

  it('should keep the transparent background transparent when it is lit', () => {
    const frame = computeFrame(
      {
        background: TRANSPARENT,
        ambient: 2,
        sprites: [],
        lights: [SUN],
        overlays: [],
      },
      1,
      2,
      1,
    );

    expect(frame).toEqual([TRANSPARENT, TRANSPARENT]);
  });

  it('should not change the old screen when it composes the frame', () => {
    const screen = createWallScreen(true);

    computeFrame(screen, 3, 7, 3);

    expect(screen).toEqual(createWallScreen(true));
  });

  it('should keep an overlay in its own colors, whatever the light does', () => {
    const frame = computeFrame(
      { ...createGrayScreen(-16), overlays: [placeOverlay(0x14, 0, 0)] },
      1,
      2,
      1,
    );

    expect(formatFrame(frame, 2)).toEqual(['rD']);
  });

  it('should keep an overlay out of the shadows', () => {
    const frame = computeFrame(
      { ...createWallScreen(true), overlays: [placeOverlay(0x14, 0, 6)] },
      3,
      7,
      3,
    );

    expect(formatFrame(frame, 7)).toEqual(['LLLWDDr', 'LLLWDDD', 'LLLWDDD']);
  });

  it('should draw an overlay over the sprites', () => {
    const frame = computeFrame(
      { ...createLayeredScreen(), overlays: [placeOverlay(0x54, 1, 0)] },
      2,
      4,
      3,
    );

    expect(formatFrame(frame, 4)).toEqual(['rrbb', 'gggb', 'bggb']);
  });
});
