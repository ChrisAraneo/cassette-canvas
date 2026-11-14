/**
 * A line across a window that separates what is above it from what is below,
 * `HUD_DIVIDER_HEIGHT` rows tall: a shadow line with a light line under it,
 * so it looks pressed into the surface. A list draws one between each two of
 * its items.
 *
 * `row` and `column` are its top-left pixel, measured from the top-left
 * pixel of the window's content, and `width` is how far it reaches. `page`
 * is the tab it belongs to, or empty to show it on every page.
 */
export interface HudDivider {
  readonly kind: 'divider';
  readonly id: string;
  readonly page: string;
  readonly row: number;
  readonly column: number;
  readonly width: number;
}
