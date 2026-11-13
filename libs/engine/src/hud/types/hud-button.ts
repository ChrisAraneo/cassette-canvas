/**
 * A button in a window. `row` and `column` are its top-left pixel, measured
 * from the top-left pixel of the window's content, and it is
 * `HUD_CONTROL_HEIGHT` tall. A `width` of 0 fits the text. Pressing and
 * releasing it returns a `click` action. `page` is the tab it belongs to, or
 * empty to show it on every page.
 */
export interface HudButton {
  readonly kind: 'button';
  readonly id: string;
  readonly page: string;
  readonly row: number;
  readonly column: number;
  readonly width: number;
  readonly text: string;
}
