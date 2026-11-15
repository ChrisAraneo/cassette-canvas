import { flatMap, fromPairs, map, range } from 'lodash-es';
import { pipe } from 'remeda';
import { COLOR_COUNT, EXTENDED_SHADE_COUNT, SHADE_COUNT } from '../consts';
import { toExtendedPixel } from '../to-extended-pixel';
import { toPixel } from '../to-pixel';
import { toExtendedShade } from './to-extended-shade';
import type { ShadeRamp } from './types/shade-ramp';
import type { ShadeRampEntry } from './types/shade-ramp-entry';

const createColorPixels = (color: number): number[] =>
  map(range(EXTENDED_SHADE_COUNT), (extendedShade) =>
    toExtendedPixel(color, extendedShade),
  );

const createColorEntries = (
  color: number,
  pixels: readonly number[],
): ShadeRampEntry[] =>
  map(range(SHADE_COUNT), (shade): ShadeRampEntry => [
    toPixel(color, shade),
    { pixels, extendedShade: toExtendedShade(shade) },
  ]);

const createRampEntries = (color: number): ShadeRampEntry[] =>
  createColorEntries(color, createColorPixels(color));

export const createShadeRamps = (): Readonly<Record<number, ShadeRamp>> =>
  pipe(
    range(COLOR_COUNT),
    (colors) => flatMap(colors, createRampEntries),
    fromPairs,
  );
