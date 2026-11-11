import { match, P } from 'ts-pattern';
import {
  BASE_SHADE,
  BLACK,
  EXTENDED_SHADES_PER_SHADE,
  SHADE_COUNT,
  WHITE,
} from '../consts';
import type { Rgb } from '../types/rgb';
import { computeRgbMix } from './compute-rgb-mix';
import { toExtendedShade } from './to-extended-shade';

const { number } = P;

const EXTENDED_BASE_SHADE = toExtendedShade(BASE_SHADE);

const DARKER_SHADES = BASE_SHADE;

const LIGHTER_SHADES = SHADE_COUNT - BASE_SHADE - 1;

const DARKEN_STEP = 1 / ((DARKER_SHADES + 1) * EXTENDED_SHADES_PER_SHADE);

const LIGHTEN_STEP = 1 / ((LIGHTER_SHADES + 1) * EXTENDED_SHADES_PER_SHADE);

export const computeExtendedShade = (base: Rgb, extendedShade: number): Rgb =>
  match(extendedShade)
    .with(number.lt(EXTENDED_BASE_SHADE), (darker) =>
      computeRgbMix(base, BLACK, (EXTENDED_BASE_SHADE - darker) * DARKEN_STEP),
    )
    .with(number.gt(EXTENDED_BASE_SHADE), (lighter) =>
      computeRgbMix(
        base,
        WHITE,
        (lighter - EXTENDED_BASE_SHADE) * LIGHTEN_STEP,
      ),
    )
    .otherwise(() => base);
