import type { Rgb } from './rgb';

/**
 * The 512 colors a display can draw (16 colors x 32 extended shades), keyed
 * by extended pixel.
 */
export type Palette = Readonly<Record<number, Rgb>>;
