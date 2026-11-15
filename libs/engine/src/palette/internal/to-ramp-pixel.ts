import { clamp, round } from 'lodash-es';
import {
  DARKEST_EXTENDED_SHADE,
  LIGHTEST_EXTENDED_SHADE,
  TRANSPARENT,
} from '../consts';
import type { ShadeRamp } from './types/shade-ramp';

export const toRampPixel = (ramp: ShadeRamp, shadeOffset: number): number =>
  ramp.pixels[
    clamp(
      round(ramp.extendedShade + shadeOffset),
      DARKEST_EXTENDED_SHADE,
      LIGHTEST_EXTENDED_SHADE,
    )
  ] ?? TRANSPARENT;
