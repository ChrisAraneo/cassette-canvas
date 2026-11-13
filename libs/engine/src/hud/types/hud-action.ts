/**
 * Something the person did to a HUD that the app may want to answer:
 *
 * - `click` a button was pressed and released. `value` is empty.
 * - `close` a window was closed with its close box, and is gone. `widget`
 *   and `value` are empty.
 * - `tab` a tab was opened. `value` is the page it opened.
 * - `type` a field's text changed. `value` is the text it now holds.
 * - `submit` Enter was pressed in a field. `value` is the text it holds.
 */
export interface HudAction {
  readonly kind: 'click' | 'close' | 'tab' | 'type' | 'submit';
  readonly window: string;
  readonly widget: string;
  readonly value: string;
}
