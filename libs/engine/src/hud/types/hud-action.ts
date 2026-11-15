/**
 * Something the person did to a HUD that the app may want to handle:
 *
 * - `CLICK` a button was pressed and released, whether it sits in the window
 *   or on an item of a list. `value` is empty.
 * - `CLOSE` a window was closed with its close box, and is gone. `widget`
 *   and `value` are empty.
 * - `TAB` a tab was opened. `value` is the page it opened.
 * - `TYPE` a field's text changed. `value` is the text it now holds.
 * - `SUBMIT` Enter was pressed in a field. `value` is the text it holds.
 * - `SELECT` an item of a list was pressed. `value` is the item's id.
 */
export interface HudAction {
  readonly kind: 'CLICK' | 'CLOSE' | 'TAB' | 'TYPE' | 'SUBMIT' | 'SELECT';
  readonly window: string;
  readonly widget: string;
  readonly value: string;
}
