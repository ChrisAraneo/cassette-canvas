/**
 * A rectangle of one pixel value, painted into an overlay. A transparent
 * `pixel` paints nothing.
 */
export interface OverlayFill {
  readonly pixel: number;
  readonly row: number;
  readonly column: number;
  readonly width: number;
  readonly height: number;
}
