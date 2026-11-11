/** A star that twinkles at night. `period` is in milliseconds. */
export interface Star {
  readonly id: string;
  readonly row: number;
  readonly column: number;
  readonly period: number;
}
