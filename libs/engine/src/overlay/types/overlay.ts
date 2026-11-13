/**
 * An image of any width and height: `width * height` pixel values, row by
 * row from the top left. Each value is a pixel such as `0x35` (color 3,
 * shade 5) or `TRANSPARENT`.
 *
 * Unlike a sprite, an overlay is not tied to the sprite size, and light
 * never touches it. Overlays are for a HUD, text, and anything else that
 * belongs over the scene rather than in it.
 */
export interface Overlay {
  readonly width: number;
  readonly height: number;
  readonly pixels: readonly number[];
}
