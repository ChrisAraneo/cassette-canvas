import { EXTENDED_SHADE_OFFSET, EXTENDED_SHADES_PER_SHADE } from '../consts';

export const toExtendedShade = (shade: number): number =>
  EXTENDED_SHADE_OFFSET + shade * EXTENDED_SHADES_PER_SHADE;
