import type { DisplaySettings } from '@cassette-canvas/engine';
import { DEMO_COLORS } from './art/consts';

export const PIXEL_SIZE = 4;

export const SPRITE_SIZE = 8;

export const DEMO_SETTINGS: DisplaySettings = Object.freeze({
  colors: DEMO_COLORS,
  pixelSize: PIXEL_SIZE,
  spriteSize: SPRITE_SIZE,
});
