import { every, inRange, keys, size, toNumber } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BASE_SHADE, BLACK, COLOR_COUNT, EXTENDED_SHADE_COUNT } from './consts';
import { createPalette } from './create-palette';
import { toExtendedPixel } from './to-extended-pixel';
import { toLitPixel } from './to-lit-pixel';
import { toPixel } from './to-pixel';
import type { PaletteColors } from './types/palette-colors';

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

const COLORS_WITH_A_TYPO: PaletteColors = [
  '#7f7f7f',
  '#d23c3',
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

describe('createPalette', () => {
  it('should hold every extended shade of every color when it expands the colors', () => {
    expect(size(keys(createPalette(COLORS)))).toBe(
      COLOR_COUNT * EXTENDED_SHADE_COUNT,
    );
  });

  it('should key the colors by extended pixel when it expands the colors', () => {
    const pixels = keys(createPalette(COLORS));

    expect(
      every(pixels, (pixel) =>
        inRange(toNumber(pixel), COLOR_COUNT * EXTENDED_SHADE_COUNT),
      ),
    ).toBe(true);
  });

  it('should show each color exactly as given when it reaches the base shade', () => {
    const palette = createPalette(COLORS);

    expect(palette[toLitPixel(toPixel(9, BASE_SHADE), 0)]).toEqual({
      red: 60,
      green: 86,
      blue: 200,
    });
  });

  it('should darken the color when it gives the darkest sprite shade', () => {
    const palette = createPalette(COLORS);

    expect(palette[toLitPixel(toPixel(1, 0), 0)]).toEqual({
      red: 42,
      green: 12,
      blue: 12,
    });
  });

  it('should hold a color darker than any sprite shade for light to reach', () => {
    const palette = createPalette(COLORS);

    expect(palette[toExtendedPixel(9, 0)]).toEqual({
      red: 9,
      green: 13,
      blue: 30,
    });
  });

  it('should fall back to black when a color is not written as a full hex color', () => {
    const palette = createPalette(COLORS_WITH_A_TYPO);

    expect(palette[toLitPixel(toPixel(1, BASE_SHADE), 0)]).toBe(BLACK);
  });
});
