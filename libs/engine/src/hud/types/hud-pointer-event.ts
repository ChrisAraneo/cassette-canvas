/**
 * The pointer went down, moved, or came up. `row` and `column` are the
 * logical pixel it is over: its offset in the canvas divided by the
 * display's `pixelSize`.
 */
export interface HudPointerEvent {
  readonly kind: 'PRESS' | 'MOVE' | 'RELEASE';
  readonly row: number;
  readonly column: number;
}
