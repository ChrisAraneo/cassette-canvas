import { map, range } from 'lodash-es';
import { SHADE_COUNT } from '../consts';
import { toPixel } from '../to-pixel';
import { toExtendedShade } from './to-extended-shade';
import type { ShadeRampEntry } from './types/shade-ramp-entry';

export const createColorEntries = (
  color: number,
  pixels: readonly number[],
): ShadeRampEntry[] =>
  map(range(SHADE_COUNT), (shade): ShadeRampEntry => [
    toPixel(color, shade),
    { pixels, extendedShade: toExtendedShade(shade) },
  ]);
