import { map, range } from 'lodash-es';
import { EXTENDED_SHADE_COUNT } from '../consts';
import { toExtendedPixel } from '../to-extended-pixel';
import type { Rgb } from '../types/rgb';
import { computeExtendedShade } from './compute-extended-shade';
import type { PaletteEntry } from './types/palette-entry';

export const createPaletteEntries = (
  base: Rgb,
  color: number,
): PaletteEntry[] =>
  map(range(EXTENDED_SHADE_COUNT), (extendedShade): PaletteEntry => [
    toExtendedPixel(color, extendedShade),
    computeExtendedShade(base, extendedShade),
  ]);
