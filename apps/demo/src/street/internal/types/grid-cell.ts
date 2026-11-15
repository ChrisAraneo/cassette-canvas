/** One tile of a building grid. `row` and `column` count tiles. */
export interface GridCell {
  readonly code: string;
  readonly row: number;
  readonly column: number;
}
