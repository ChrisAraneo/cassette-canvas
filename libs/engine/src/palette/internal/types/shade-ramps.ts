import type { ShadeRamp } from './shade-ramp';

/** The shade ramp every pixel moves along, keyed by pixel. */
export type ShadeRamps = Readonly<Record<number, ShadeRamp>>;
