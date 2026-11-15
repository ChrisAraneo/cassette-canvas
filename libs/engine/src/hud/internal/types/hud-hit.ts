/**
 * What a point on the screen is over: the window it found, and which part of
 * it. `widget` names the widget when `part` is `widget`, and is empty
 * otherwise.
 */
export interface HudHit {
  readonly window: string;
  readonly part: 'CLOSE' | 'TITLE' | 'BODY' | 'WIDGET';
  readonly widget: string;
}
