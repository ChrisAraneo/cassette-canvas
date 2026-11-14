/**
 * The screen a HUD is on, in logical pixels: a display's `width` and
 * `height`. No window can be dragged past its edges.
 */
export interface HudSize {
  readonly width: number;
  readonly height: number;
}
