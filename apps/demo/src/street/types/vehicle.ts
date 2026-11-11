import type { Mover } from './mover';

/** A mover with a headlight that shines at night. */
export interface Vehicle extends Mover {
  /** Where the headlight is, from the top-left pixel of the vehicle. */
  readonly headlight: { readonly row: number; readonly column: number };
}
