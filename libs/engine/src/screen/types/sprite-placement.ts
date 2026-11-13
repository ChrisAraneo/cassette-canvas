import type { Sprite } from './sprite';

/**
 * A sprite on the screen. `row` and `column` set its top-left pixel. If
 * `castsShadow` is `true`, its non-transparent pixels block light.
 */
export interface SpritePlacement {
  readonly id: string;
  readonly sprite: Sprite;
  readonly row: number;
  readonly column: number;
  readonly castsShadow: boolean;
}
