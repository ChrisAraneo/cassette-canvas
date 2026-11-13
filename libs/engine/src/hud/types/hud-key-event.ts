/**
 * A key went down. `key` is the browser's `KeyboardEvent.key`: one character
 * to type that character, or a name such as `Backspace`, `Enter` or
 * `Escape`.
 */
export interface HudKeyEvent {
  readonly kind: 'key';
  readonly key: string;
}
