/**
 * What the pointer is holding:
 *
 * - `DRAG` a title bar. `row` and `column` are where inside the window the
 *   pointer grabbed it, so the window keeps that spot under the pointer.
 * - `PRESS` a button, named by `widget`.
 * - `SCROLL` the thumb on the scroll bar of a list, named by `widget`. `row`
 *   and `column` are where inside the thumb the pointer grabbed it, so the
 *   thumb keeps that spot under the pointer while it is dragged.
 * - `CLOSE` a close box.
 */
export interface HudGrab {
  readonly kind: 'DRAG' | 'PRESS' | 'SCROLL' | 'CLOSE';
  readonly window: string;
  readonly widget: string;
  readonly row: number;
  readonly column: number;
}
