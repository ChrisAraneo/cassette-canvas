/** A rectangle of logical pixels. `row` and `column` are its top-left pixel. */
export interface HudRect {
  readonly row: number;
  readonly column: number;
  readonly width: number;
  readonly height: number;
}
