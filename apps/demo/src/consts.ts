import type { DisplaySettings } from '@cassette-canvas/engine';
import { DEMO_COLORS } from './art/consts';

/** One whole turn in radians, for the circles the scenery moves on. */
export const FULL_TURN = 2 * Math.PI;

export const MILLISECONDS_PER_SECOND = 1000;

export const PIXEL_SIZE = 4;

export const SPRITE_SIZE = 8;

export const DEMO_SETTINGS: DisplaySettings = Object.freeze({
  colors: DEMO_COLORS,
  pixelSize: PIXEL_SIZE,
  spriteSize: SPRITE_SIZE,
});
