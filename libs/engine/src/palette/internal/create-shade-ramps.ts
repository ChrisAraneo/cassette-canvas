import { flatMap, fromPairs, map, range } from 'lodash-es';
import { COLOR_COUNT, EXTENDED_SHADE_COUNT, SHADE_COUNT } from '../consts';
import { toExtendedPixel } from '../to-extended-pixel';
import { toPixel } from '../to-pixel';
import { toExtendedShade } from './to-extended-shade';
import type { ShadeRamp } from './types/shade-ramp';
import type { ShadeRampEntry } from './types/shade-ramp-entry';

const createColorEntries = (
  color: number,
  pixels: readonly number[],
): ShadeRampEntry[] =>
  map(range(SHADE_COUNT), (shade): ShadeRampEntry => [
    toPixel(color, shade),
    { pixels, extendedShade: toExtendedShade(shade) },
  ]);

export const createShadeRamps = (): Readonly<Record<number, ShadeRamp>> =>
  fromPairs(
    flatMap(range(COLOR_COUNT), (color) =>
      createColorEntries(
        color,
        map(range(EXTENDED_SHADE_COUNT), (extendedShade) =>
          toExtendedPixel(color, extendedShade),
        ),
      ),
    ),
  );
