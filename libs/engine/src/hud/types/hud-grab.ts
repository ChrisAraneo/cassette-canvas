/**
 * What the pointer is holding:
 *
 * - `drag` a title bar. `row` and `column` are where inside the window the
 *   pointer grabbed it, so the window keeps that spot under the pointer.
 * - `press` a button, named by `widget`.
 * - `close` a close box.
 */
export interface HudGrab {
  readonly kind: 'drag' | 'press' | 'close';
  readonly window: string;
  readonly widget: string;
  readonly row: number;
  readonly column: number;
}
