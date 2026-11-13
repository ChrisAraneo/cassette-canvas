import type { Overlay } from './overlay';

/**
 * An overlay painted into another overlay, with its top-left pixel at `row`
 * and `column`. Its transparent pixels leave what is below.
 */
export interface OverlayImage {
  readonly image: Overlay;
  readonly row: number;
  readonly column: number;
}
