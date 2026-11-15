/** Where a headlight sits, from the top-left pixel of the vehicle. */
export interface HeadlightOffset {
  /** Rows down from the top of the vehicle. */
  readonly row: number;

  /** Columns right of the left edge of the vehicle. */
  readonly column: number;
}
