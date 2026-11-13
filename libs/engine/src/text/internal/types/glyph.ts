/**
 * One character of the built-in font. `advance` is how far the pen moves to
 * the next character, `top` is where the art starts, measured from the top
 * of a capital (a negative `top` reaches above it), and `rows` is the art,
 * one string per row, where `#` is ink.
 */
export interface Glyph {
  readonly advance: number;
  readonly top: number;
  readonly rows: readonly string[];
}
