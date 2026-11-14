/**
 * A panel in a window: the body of a window without its title bar, so
 * nothing can drag it. `row` and `column` are its top-left pixel, measured
 * from the top-left pixel of the window's content, and `width` and `height`
 * its size in logical pixels.
 *
 * A window is drawn as a panel with a title bar on it, so a panel inside one
 * looks like a window within the window. Use it to group widgets: list it
 * before the widgets that sit on it, because a window paints its widgets in
 * the order it holds them. `page` is the tab it belongs to, or empty to show
 * it on every page.
 */
export interface HudPanel {
  readonly kind: 'panel';
  readonly id: string;
  readonly page: string;
  readonly row: number;
  readonly column: number;
  readonly width: number;
  readonly height: number;
}
