import type { PaletteColors } from '../../palette/types/palette-colors';

/** The settings for creating a display. */
export interface DisplaySettings {
  /** The 16 base colors. Sprites can use 8 shades of each. */
  readonly colors: PaletteColors;
  /** The width and height of one logical pixel, in canvas pixels. */
  readonly pixelSize: number;
  /** The width and height of every sprite, in logical pixels. */
  readonly spriteSize: number;
}
