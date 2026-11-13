/**
 * How a HUD is drawn: one base color, and the shades of it that make the
 * surfaces, the bevels and the letters. A HUD is mono, so every window is
 * built from shades of a single color.
 *
 * `color` is a palette color (0 to 15) and every other field is a shade of
 * it (0 to 7).
 */
export interface HudTheme {
  readonly color: number;
  readonly edge: number;
  readonly shadow: number;
  readonly title: number;
  readonly body: number;
  readonly face: number;
  readonly highlight: number;
  readonly text: number;
}
