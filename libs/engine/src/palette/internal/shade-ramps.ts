import { createShadeRamps } from './create-shade-ramps';
import type { ShadeRamp } from './types/shade-ramp';

export const SHADE_RAMPS: Readonly<Record<number, ShadeRamp>> =
  Object.freeze(createShadeRamps());
