import type { Overlay } from './overlay';

/**
 * An overlay on the screen. `row` and `column` set its top-left pixel.
 * Overlays are drawn after the sprites have been lit, in order, so later
 * overlays cover earlier ones. Neither ambient light, nor lights, nor
 * shadows reach them.
 */
export interface OverlayPlacement {
  readonly id: string;
  readonly overlay: Overlay;
  readonly row: number;
  readonly column: number;
}
