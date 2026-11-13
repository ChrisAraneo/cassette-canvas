import type { HudWidget } from './hud-widget';

/**
 * A window. `row` and `column` are its top-left pixel on the screen, and
 * `width` and `height` its size in logical pixels, frame and title bar
 * included. `color` is the palette color it is drawn in, so windows can
 * differ from each other while each one stays monochrome. `page` is the open
 * tab, or empty when the window has no tabs. Dragging the title bar moves
 * the window, and the close box shows when `closable` is `true`.
 */
export interface HudWindow {
  readonly id: string;
  readonly title: string;
  readonly row: number;
  readonly column: number;
  readonly width: number;
  readonly height: number;
  readonly color: number;
  readonly closable: boolean;
  readonly page: string;
  readonly widgets: readonly HudWidget[];
}
