/**
 * A field that takes typed text. `row` and `column` are its top-left pixel,
 * measured from the top-left pixel of the window's content, and it is
 * `HUD_CONTROL_HEIGHT` tall. Clicking it sets the focus on it; typing
 * returns a `type` action and Enter a `submit` action. Text that does not fit
 * scrolls, so its end and the caret stay visible. `page` is the tab it
 * belongs to, or empty to show it on every page.
 */
export interface HudInput {
  readonly kind: 'input';
  readonly id: string;
  readonly page: string;
  readonly row: number;
  readonly column: number;
  readonly width: number;
  readonly text: string;
}
