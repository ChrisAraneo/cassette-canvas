import type { Rgb } from './types/rgb';

/** The number of base colors in a palette. */
export const COLOR_COUNT = 16;

/** The number of shades of each color that sprites and backgrounds use. */
export const SHADE_COUNT = 8;

/**
 * The shade that shows a base color exactly as given. Lower shades are
 * darker, higher shades are lighter.
 */
export const BASE_SHADE = 4;

/**
 * The number of shades of each color that lighting uses. The finer scale
 * lets light fade in smaller steps than sprite shades.
 */
export const EXTENDED_SHADE_COUNT = 32;

/** The number of extended shades in one sprite shade. */
export const EXTENDED_SHADES_PER_SHADE = EXTENDED_SHADE_COUNT / SHADE_COUNT;

export const EXTENDED_SHADE_OFFSET = 1;

export const COLOR_STRIDE = 0x10;

/** The pixel value that draws nothing. Whatever is below shows through. */
export const TRANSPARENT = -1;

export const CHANNEL_MAX = 255;

export const BLACK: Rgb = Object.freeze({ red: 0, green: 0, blue: 0 });

export const WHITE: Rgb = Object.freeze({
  red: CHANNEL_MAX,
  green: CHANNEL_MAX,
  blue: CHANNEL_MAX,
});
