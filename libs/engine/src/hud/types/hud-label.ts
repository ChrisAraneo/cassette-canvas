/**
 * A line of text in a window. `row` is the top of its capitals and `column`
 * its first character, both measured from the top-left pixel of the window's
 * content. `page` is the tab it belongs to, or empty to show it on every
 * page.
 */
export interface HudLabel {
  readonly kind: 'label';
  readonly id: string;
  readonly page: string;
  readonly row: number;
  readonly column: number;
  readonly text: string;
}
