/**
 * Where the sun or the moon is. `row` and `column` are its center. `height`
 * goes from -1 (lowest, below the horizon) to 1 (highest).
 */
export interface Orb {
  readonly row: number;
  readonly column: number;
  readonly height: number;
}
